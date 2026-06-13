package sos_mascotas.report_service.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import sos_mascotas.report_service.DTO.CreateReportRequest;
import sos_mascotas.report_service.DTO.ReportResponse;
import sos_mascotas.report_service.model.EstadoReporte;
import sos_mascotas.report_service.model.TipoReporte;
import sos_mascotas.report_service.service.ReportService;

class ReportControllerTest {

    private final ReportService reportService = org.mockito.Mockito.mock(ReportService.class);
    private final ReportController reportController = new ReportController(reportService);

    @Test
    void listReturnsReportsFromService() {
        var expected = List.of(response(1L));
        when(reportService.list(TipoReporte.ANIMAL_PERDIDO, "plaza")).thenReturn(expected);

        var response = reportController.list(TipoReporte.ANIMAL_PERDIDO, "plaza");

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(expected);
        verify(reportService).list(TipoReporte.ANIMAL_PERDIDO, "plaza");
    }

    @Test
    void getReturnsReportById() {
        var expected = response(1L);
        when(reportService.getById(1L)).thenReturn(expected);

        var response = reportController.get(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(expected);
        verify(reportService).getById(1L);
    }

    @Test
    void createReturnsCreatedReport() {
        var request = new CreateReportRequest(
                "Mascota perdida",
                TipoReporte.ANIMAL_PERDIDO,
                "Perro visto cerca de la plaza",
                "Santiago",
                null,
                "+56912345678");
        var expected = response(1L);
        when(reportService.create("Bearer token", request)).thenReturn(expected);

        var response = reportController.create("Bearer token", request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isEqualTo(expected);
        verify(reportService).create("Bearer token", request);
    }

    @Test
    void updateEstadoReturnsUpdatedReport() {
        var expected = response(1L);
        when(reportService.updateEstado("Bearer token", 1L, EstadoReporte.ENCONTRADO)).thenReturn(expected);

        var response = reportController.updateEstado("Bearer token", 1L, EstadoReporte.ENCONTRADO);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(expected);
        verify(reportService).updateEstado("Bearer token", 1L, EstadoReporte.ENCONTRADO);
    }

    @Test
    void deleteReturnsNoContentAfterServiceDeletion() {
        var response = reportController.delete("Bearer token", 1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
        verify(reportService).delete("Bearer token", 1L);
    }

    private ReportResponse response(Long id) {
        return new ReportResponse(
                id,
                "Mascota perdida",
                TipoReporte.ANIMAL_PERDIDO,
                EstadoReporte.ACTIVO,
                "Descripcion",
                "Santiago",
                null,
                "+56912345678",
                "usuario-7",
                LocalDateTime.of(2024, 5, 1, 12, 0));
    }
}
