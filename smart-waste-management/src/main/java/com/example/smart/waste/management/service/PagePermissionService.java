package com.example.smart.waste.management.service;

import com.example.smart.waste.management.model.Page;
import com.example.smart.waste.management.model.PageAssignment;
import com.example.smart.waste.management.model.User;
import com.example.smart.waste.management.repository.PageAssignmentRepository;
import com.example.smart.waste.management.repository.PageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PagePermissionService {

    private final PageRepository pageRepository;
    private final PageAssignmentRepository assignmentRepository;

    /**
     * Check whether the given user can access the page whose path is provided.
     * If page is not registered in DB, default to true (or change to false based on policy).
     */
    public boolean canAccess(User user, String requestPath) {
        if (user == null) return false;

        // admins have implicit access to everything
        if (user.getRole() != null && user.getRole().name().equals("ADMIN")) return true;

        // try to find page by exact path
        Optional<Page> maybePage = pageRepository.findByPath(requestPath);
        if (!maybePage.isPresent()) {
            // attempt loose matching: strip query params and trailing slashes
            String normalized = normalizePath(requestPath);
            maybePage = pageRepository.findByPath(normalized);
        }

        if (!maybePage.isPresent()) {
            // If page not registered, allow access by default; change this to false to lock down unknown pages
            return true;
        }

        Page page = maybePage.get();
        Optional<PageAssignment> assign = assignmentRepository.findByUserAndPage(user, page);
        return assign.map(PageAssignment::isCanAccess).orElse(false);
    }

    private String normalizePath(String p) {
        if (p == null) return "";
        int q = p.indexOf('?');
        String base = q >= 0 ? p.substring(0, q) : p;
        if (base.endsWith("/")) base = base.substring(0, base.length() - 1);
        return base;
    }
}
