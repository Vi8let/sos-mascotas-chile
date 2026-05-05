package sos_mascotas.backend.DTO;

import sos_mascotas.backend.model.Role;

public record UserInfoResponse(
    Long id,
    String email,
    String nombre,
    Role role
) {}

    
