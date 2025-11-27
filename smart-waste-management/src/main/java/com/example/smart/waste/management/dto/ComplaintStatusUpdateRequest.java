package com.example.smart.waste.management.dto;

import com.example.smart.waste.management.model.ComplaintStatus;
import lombok.Data;

@Data
public class ComplaintStatusUpdateRequest {
    private ComplaintStatus status;
}
