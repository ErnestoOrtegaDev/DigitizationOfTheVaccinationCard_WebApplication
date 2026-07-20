describe('Módulo de Registro y Autenticación - VacunApp MX', () => {
  it('Debe registrar un nuevo usuario e iniciar sesión automáticamente', () => {
    const testEmail = `testuser_${Date.now()}@vacunapp.com`;
    const testPassword = 'securepassword123';

    // Visitar la página principal
    cy.visit('/');

    // Navegar a la vista de registro
    cy.get('a[href="/register"]').click();
    cy.url().should('include', '/register');

    // Rellenar los campos del formulario de registro
    cy.get('input[type="email"]').type(testEmail);
    cy.get('input[type="password"]').first().type(testPassword);
    cy.get('input[type="password"]').last().type(testPassword);

    // Enviar el formulario de registro
    cy.get('button[type="submit"]').click();

    // Verificar que la plataforma redirige al login tras el éxito
    cy.url().should('include', '/login');

    // Rellenar el formulario de inicio de sesión con el usuario recién creado
    cy.get('input[type="email"]').type(testEmail);
    cy.get('input[type="password"]').type(testPassword);

    // Enviar el formulario de login
    cy.get('button[type="submit"]').click();

    // Validar el acceso exitoso al panel de control (Dashboard)
    cy.url().should('include', '/dashboard');
    cy.contains('VacunApp MX').should('be.visible');
  });
});