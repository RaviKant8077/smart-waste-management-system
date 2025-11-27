package com.example.smart.waste.management.dto;

import com.example.smart.waste.management.model.CollectionStatus1;
import javax.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CollectionUpdateRequest {
    @NotNull
    private Long routeId;

    @NotNull
    private Long waypointId;

    @NotNull
    private CollectionStatus1 status;

    private String photoUrl;

    @NotNull
    private Double latitude;

    @NotNull
    private Double longitude;
}