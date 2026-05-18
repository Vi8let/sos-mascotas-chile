package sos_mascotas.backend.DTO;

import java.time.LocalDateTime;

import sos_mascotas.backend.model.EstadoReporte;
import sos_mascotas.backend.model.TipoReporte;

public record ReportResponse(
        Long id,
        String titulo,
        TipoReporte tipo,
        EstadoReporte estado,
        String descripcion,
        String ubicacion,
        String imagenUrl,
        String contacto,
        String autorNombre,
        LocalDateTime creadoEn) {
}
