package org.example;

import java.nio.file.attribute.FileTime;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathFactory;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.example.ButtonConfig;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class CommandController {

    private final String buttonConfigPath = "button-config.json";

    @GetMapping("/button-config")
    public ResponseEntity<List<ButtonConfig>> getButtonConfig() {
        ObjectMapper mapper = new ObjectMapper();
        try {
            List<ButtonConfig> configs = mapper.readValue(
                    new File(buttonConfigPath),
                    new TypeReference<List<ButtonConfig>>() {}
            );
            return ResponseEntity.ok(configs);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).build();
        }
    }

    public static class XmlUploadRequest {
        private String path;
        public String getPath() { return path; }
        public void setPath(String path) { this.path = path; }
    }

    public static class CommandRequest {
        private String batchFile;
        private List<String> params;

        public String getBatchFile() { return batchFile; }
        public void setBatchFile(String batchFile) { this.batchFile = batchFile; }

        public List<String> getParams() { return params; }
        public void setParams(List<String> params) { this.params = params; }
    }

    @PostMapping("/execute")
    public ResponseEntity<String> executeBatch(@RequestBody CommandRequest request) {
        File batchFile = new File(request.getBatchFile());

        if (!batchFile.exists() || (!batchFile.getName().endsWith(".cmd") && !batchFile.getName().endsWith(".bat"))) {
            return ResponseEntity.badRequest().body("Invalid batch file.");
        }

        try {
            List<String> command = new ArrayList<>();
            command.add("cmd.exe");
            command.add("/c");
            command.add(batchFile.getAbsolutePath());

            if (request.getParams() != null) {
                for (String param : request.getParams()) {
                    command.add("\"" + param + "\"");
                }
            }

            ProcessBuilder pb = new ProcessBuilder(command);
            pb.redirectErrorStream(true);
            Process process = pb.start();

            StringBuilder output = new StringBuilder();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }
            }

            int exitCode = process.waitFor();
            return ResponseEntity.ok("Exit code: " + exitCode + "\n\nOutput:\n" + output);

        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Execution failed: " + e.getMessage());
        }
    }

    @PostMapping("/upload-xml")
    public ResponseEntity<List<Map<String, String>>> uploadFromXml(@RequestBody XmlUploadRequest request) {
        try {
            File xmlFile = new File(request.getPath());
            if (!xmlFile.exists()) {
                return ResponseEntity.status(400)
                        .body(List.of(Map.of("error", "XML file not found at: " + request.getPath())));
            }

            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document doc = builder.parse(xmlFile);

            XPath xpath = XPathFactory.newInstance().newXPath();
            NodeList fileNodes = (NodeList) xpath.evaluate("//Comparer_OutputFile", doc, XPathConstants.NODESET);

            List<Map<String, String>> filesToUpload = new ArrayList<>();
            for (int i = 0; i < fileNodes.getLength(); i++) {
                String filePath = fileNodes.item(i).getTextContent();
                Path txtFile = Paths.get(filePath);

                if (Files.exists(txtFile)) {
                    String content = new String(Files.readAllBytes(txtFile), StandardCharsets.UTF_8);
                    String encodedContent = Base64.getEncoder().encodeToString(content.getBytes(StandardCharsets.UTF_8));
                    FileTime lastModifiedTime = Files.getLastModifiedTime(txtFile);

                    filesToUpload.add(Map.of(
                            "fileName", txtFile.getFileName().toString(),
                            "content", encodedContent,
                            "lastModified", String.valueOf(lastModifiedTime.toMillis())
                    ));
                } else {
                    filesToUpload.add(Map.of(
                            "error", "File not found: " + filePath,
                            "fileName", txtFile.getFileName().toString()
                    ));
                }
            }

            if (filesToUpload.stream().anyMatch(f -> f.containsKey("error"))) {
                return ResponseEntity.status(400).body(filesToUpload);
            }
            return ResponseEntity.ok(filesToUpload);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(List.of(Map.of("error", "Error processing XML: " + e.getMessage())));
        }
    }

    @GetMapping("/health")
    public String healthCheck() {
        return "Backend is running!";
    }
}