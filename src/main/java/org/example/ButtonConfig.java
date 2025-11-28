package org.example;

import java.util.List;

public class ButtonConfig {
    private String label;
    private String executable;
    private List<String> params;
    private String description;

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getExecutable() { return executable; }
    public void setExecutable(String executable) { this.executable = executable; }

    public List<String> getParams() { return params; }
    public void setParams(List<String> params) { this.params = params; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}