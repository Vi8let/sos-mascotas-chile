package sos_mascotas.report_service.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import sos_mascotas.report_service.DTO.CreateReportRequest;
import sos_mascotas.report_service.DTO.UserInfoResponse;
import sos_mascotas.report_service.config.UserServiceClient;
import sos_mascotas.report_service.exception.SecurityException;
import sos_mascotas.report_service.model.EstadoReporte;
import sos_mascotas.report_service.model.Report;
import sos_mascotas.report_service.model.TipoReporte;
import sos_mascotas.report_service.repository.ReportRepository;

class ReportServiceTest {

    private final ReportRepository reportRepository = org.mockito.Mockito.mock(ReportRepository.class);
    private final UserServiceClient userServiceClient = org.mockito.Mockito.mock(UserServiceClient.class);
    private final ReportService reportService = new ReportService(reportRepository, userServiceClient);

    @Test
    void createAssignsAuthenticatedUserAsAuthor() {
        var request = new CreateReportRequest(
                "Mascota perdida",
                TipoReporte.ANIMAL_PERDIDO,
                "Perro visto cerca de la plaza",
                "Santiago",
                null,
                "+56912345678");

        when(userServiceClient.validateToken("Bearer token"))
                .thenReturn(new UserInfoResponse(7L, "persona@test.cl", "Persona", "ROLE_USER"));
        when(reportRepository.save(any(Report.class))).thenAnswer(invocation -> invocation.getArgument(0));

        var response = reportService.create("Bearer token", request);

        ArgumentCaptor<Report> captor = ArgumentCaptor.forClass(Report.class);
        verify(reportRepository).save(captor.capture());

        assertThat(captor.getValue().getAutorId()).isEqualTo(7L);
        assertThat(response.titulo()).isEqualTo("Mascota perdida");
        assertThat(response.autorNombre()).isEqualTo("usuario-7");
    }

    @Test
    void listUsesSearchWhenQueryIsProvided() {
        var report = report("Mascota encontrada", 7L);
        when(reportRepository.search("plaza")).thenReturn(List.of(report));

        var response = reportService.list(TipoReporte.ANIMAL_PERDIDO, "plaza");

        assertThat(response).hasSize(1);
        assertThat(response.get(0).titulo()).isEqualTo("Mascota encontrada");
        verify(reportRepository).search("plaza");
    }

    @Test
    void listUsesTypeFilterWhenQueryIsBlank() {
        var report = report("Objeto perdido", 8L);
        report.setTipo(TipoReporte.OBJETO_PERDIDO);
        when(reportRepository.findByTipo(TipoReporte.OBJETO_PERDIDO)).thenReturn(List.of(report));

        var response = reportService.list(TipoReporte.OBJETO_PERDIDO, " ");

        assertThat(response).hasSize(1);
        assertThat(response.get(0).tipo()).isEqualTo(TipoReporte.OBJETO_PERDIDO);
        verify(reportRepository).findByTipo(TipoReporte.OBJETO_PERDIDO);
    }

    @Test
    void getByIdThrowsWhenReportDoesNotExist() {
        when(reportRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> reportService.getById(99L))
                .isInstanceOf(NoSuchElementException.class)
                .hasMessage("Reporte no encontrado");
    }

    @Test
    void updateEstadoAllowsAuthorToCloseReport() {
        var report = report("Mascota encontrada", 7L);
        when(userServiceClient.validateToken("Bearer token"))
                .thenReturn(new UserInfoResponse(7L, "persona@test.cl", "Persona", "ROLE_USER"));
        when(reportRepository.findById(1L)).thenReturn(Optional.of(report));
        when(reportRepository.save(report)).thenReturn(report);

        var response = reportService.updateEstado("Bearer token", 1L, EstadoReporte.ENCONTRADO);

        assertThat(response.estado()).isEqualTo(EstadoReporte.ENCONTRADO);
        verify(reportRepository).save(report);
    }

    @Test
    void updateEstadoRejectsUserThatIsNotAuthorOrAdmin() {
        var report = report("Mascota encontrada", 7L);
        when(userServiceClient.validateToken("Bearer token"))
                .thenReturn(new UserInfoResponse(20L, "otra@test.cl", "Otra", "ROLE_USER"));
        when(reportRepository.findById(1L)).thenReturn(Optional.of(report));

        assertThatThrownBy(() -> reportService.updateEstado("Bearer token", 1L, EstadoReporte.CERRADO))
                .isInstanceOf(SecurityException.class)
                .hasMessage("Sin permiso para modificar este reporte");

        verify(reportRepository, never()).save(any(Report.class));
    }

    @Test
    void deleteAllowsAdminEvenWhenAdminIsNotAuthor() {
        var report = report("Mascota encontrada", 7L);
        when(userServiceClient.validateToken("Bearer token"))
                .thenReturn(new UserInfoResponse(1L, "admin@test.cl", "Admin", "ROLE_ADMIN"));
        when(reportRepository.findById(1L)).thenReturn(Optional.of(report));

        reportService.delete("Bearer token", 1L);

        verify(reportRepository).delete(report);
    }

    @Test
    void deleteRejectsUserThatIsNotAuthorOrAdmin() {
        var report = report("Mascota encontrada", 7L);
        when(userServiceClient.validateToken("Bearer token"))
                .thenReturn(new UserInfoResponse(20L, "otra@test.cl", "Otra", "ROLE_USER"));
        when(reportRepository.findById(1L)).thenReturn(Optional.of(report));

        assertThatThrownBy(() -> reportService.delete("Bearer token", 1L))
                .isInstanceOf(SecurityException.class)
                .hasMessage("Sin permiso para eliminar este reporte");

        verify(reportRepository, never()).delete(any(Report.class));
    }

    private Report report(String titulo, Long autorId) {
        var report = new Report();
        report.setId(1L);
        report.setTitulo(titulo);
        report.setTipo(TipoReporte.ANIMAL_PERDIDO);
        report.setEstado(EstadoReporte.ACTIVO);
        report.setDescripcion("Descripcion de prueba");
        report.setUbicacion("Santiago");
        report.setContacto("+56912345678");
        report.setAutorId(autorId);
        return report;
    }
}
