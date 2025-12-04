package com.example.smart.waste.management.security;

import com.example.smart.waste.management.model.User;
import com.example.smart.waste.management.repository.UserRepository;
import com.example.smart.waste.management.service.PagePermissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class PageAccessFilter extends OncePerRequestFilter {

    private final PagePermissionService permissionService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String path = request.getRequestURI();

        // always allow auth, websocket, actuator, and root endpoints
        if (path.equals("/") || path.startsWith("/api/auth") || path.startsWith("/ws") || path.startsWith("/public") || path.startsWith("/static") || path.startsWith("/uploads") || path.startsWith("/actuator")) {
            filterChain.doFilter(request, response);
            return;
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            filterChain.doFilter(request, response);
            return;
        }

        Object principal = auth.getPrincipal();
        User user = null;
        if (principal instanceof User) {
            user = (User) principal;
        } else if (principal instanceof org.springframework.security.core.userdetails.User) {
            String username = ((org.springframework.security.core.userdetails.User) principal).getUsername();
            Optional<User> u = userRepository.findByEmail(username);
            if (u.isPresent()) user = u.get();
        } else if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
            String username = ((org.springframework.security.core.userdetails.UserDetails) principal).getUsername();
            Optional<User> u = userRepository.findByEmail(username);
            if (u.isPresent()) user = u.get();
        }

        if (user == null) {
            // can't resolve user; allow by default or block - we choose block
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access denied");
            return;
        }

        boolean allowed = permissionService.canAccess(user, path);
        if (!allowed) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Access denied");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
