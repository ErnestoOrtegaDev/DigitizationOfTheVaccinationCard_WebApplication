describe('Módulo de Vacunas - VacunApp MX', () => {
  beforeEach(() => {
    // Iniciar sesión como administrador
    cy.visit('/login');
    cy.get('input[type="email"]').type('ernesto.dev@vacunapp.mx');
    cy.get('input[type="password"]').type('admin1234');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });

  it('Debe permitir visualizar el catálogo de vacunas, registrar una nueva y editarla', () => {
    // Ir a la sección de vacunas
    cy.get('a[href="/vaccines"]').click();
    cy.url().should('include', '/vaccines');

    // Verificar elementos clave de la vista
    cy.contains('Catálogo de Vacunas').should('be.visible');
    cy.contains('Nueva Vacuna').should('be.visible');

    // Registrar una nueva vacuna
    cy.contains('Nueva Vacuna').click();
    
    // Rellenar formulario del modal de vacuna
    const vaccineName = `Vacuna Test ${Date.now()}`;
    cy.get('input[placeholder="Ej. BCG"]').type(vaccineName);
    cy.get('input[placeholder="Ej. Tuberculosis"]').type('Enfermedad de Prueba');
    cy.get('input[placeholder="Ej. Intradérmica"]').type('Subcutánea');
    
    // Guardar el nuevo registro
    cy.contains('button', 'Guardar').click();

    // Editar la vacuna recién creada
    // Buscamos la fila que contiene el nombre de nuestra vacuna de prueba y hacemos clic en su botón de editar (icono/lápiz)
    cy.contains('tr', vaccineName)
      .find('button')
      .first()
      .click();

    // Modificar un campo en el modal de edición (por ejemplo, el método de administración)
    cy.get('input[placeholder="Ej. Intradérmica"]').clear().type('Intramuscular Modificada');
    
    // Guardar los cambios
    cy.contains('button', 'Guardar').click();

    // Verificar que el cambio se refleje en la tabla
    cy.contains('Intramuscular Modificada').should('be.visible');
  });
});