package com.example.smart.waste.management.dto;

import javax.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RouteCompletionRequest {
    @NotNull
    private Long routeId;

    private String remark;

    private String photoUrl; // Base64 encoded image or file path
}
