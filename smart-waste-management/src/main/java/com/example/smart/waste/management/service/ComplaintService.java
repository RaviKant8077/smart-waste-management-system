package com.example.smart.waste.management.service;

import com.example.smart.waste.management.model.Complaint;
import com.example.smart.waste.management.model.ComplaintPriority;
import com.example.smart.waste.management.model.ComplaintStatus;
import com.example.smart.waste.management.model.User;
import com.example.smart.waste.management.repository.ComplaintRepository;
import com.example.smart.waste.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;

    public Complaint createComplaint(
            Long citizenId,
            String title,
            String description,
            String photoUrl,
            Double latitude,
            Double longitude,
            String location,
            List<String> images
    ) {
        User citizen = userRepository.findById(citizenId)
                .orElseThrow(() -> new RuntimeException("Citizen not found"));

        Complaint complaint = new Complaint();
        complaint.setCitizen(citizen);
        complaint.setTitle(title);
        complaint.setDescription(description);
        complaint.setPhotoUrl(photoUrl);
        complaint.setLatitude(latitude);
        complaint.setLongitude(longitude);
        complaint.setLocation(location);
        complaint.setImages(images);
        complaint.setStatus(ComplaintStatus.PENDING);
        complaint.setPriority(ComplaintPriority.MEDIUM); // Default priority
        complaint.setCreatedAt(LocalDateTime.now());
        complaint.setUpdatedAt(LocalDateTime.now());

        return complaintRepository.save(complaint);
    }

    public List<Complaint> getCitizenComplaints(Long citizenId) {
        return complaintRepository.findByCitizenId(citizenId);
    }

    public Complaint updateComplaintStatus(Long complaintId, ComplaintStatus status) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        
        complaint.setStatus(status);
        return complaintRepository.save(complaint);
    }
}