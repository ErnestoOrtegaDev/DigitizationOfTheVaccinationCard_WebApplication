describe('Módulo de Autenticación - VacunApp MX', () => {
  it('Debe permitir al usuario navegar al login e ingresar credenciales', () => {
    // Visitar la página principal
    cy.visit('/');

    // Hacer clic en el botón de acceso o navegar directo a login
    cy.get('a[href="/login"]').click();
    cy.url().should('include', '/login');

    // Rellenar el formulario de inicio de sesión
    cy.get('input[type="email"]').type('ernesto.dev@vacunapp.mx');
    cy.get('input[type="password"]').type('admin1234');

    // Enviar el formulario
    cy.get('button[type="submit"]').click();

    // Verificar la redirección exitosa al dashboard
    cy.url().should('include', '/dashboard');
    cy.contains('VacunApp MX').should('be.visible');
  });
});