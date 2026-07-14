import pool from '../config/db.js'; 

export const globalSearch = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(200).json({ success: true, data: [] });
    }

    const searchTerm = `%${q.trim()}%`;

    const [patients, vaccines, campaigns] = await Promise.all([
      pool.query(
        'SELECT id, curp, full_name FROM patients WHERE full_name LIKE ? OR curp LIKE ? LIMIT 5',
        { replacements: [searchTerm, searchTerm] }
      ),
      pool.query(
        'SELECT id, name FROM vaccines WHERE name LIKE ? LIMIT 5',
        { replacements: [searchTerm] }
      ),
      pool.query(
        'SELECT id, title FROM campaigns WHERE title LIKE ? LIMIT 5',
        { replacements: [searchTerm] }
      )
    ]);

    const results = [
      ...patients[0].map(p => ({ 
        type: 'Paciente', 
        label: `${p.full_name} (CURP: ${p.curp})`, 
        path: `/patients` 
      })),
      ...vaccines[0].map(v => ({ 
        type: 'Vacuna', 
        label: v.name, 
        path: `/vaccines` 
      })),
      ...campaigns[0].map(c => ({ 
        type: 'Campaña', 
        label: c.title, 
        path: `/campaigns` 
      }))
    ];

    res.status(200).json({ success: true, data: results });
  } catch (error) {
    console.error('Error en búsqueda global:', error);
    res.status(500).json({ success: false, message: 'Error interno al realizar la búsqueda.' });
  }
};