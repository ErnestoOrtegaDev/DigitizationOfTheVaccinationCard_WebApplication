import pool from '../config/db.js';

export const getDashboardStats = async (req, res) => {
  try {
    const [
      [patientsCount],
      [activeCampaigns],
      [vaccinesStock],
      [appliedDoses],
      monthlyAnalytics
    ] = await Promise.all([
      pool.query('SELECT COUNT(*) as total FROM patients WHERE status = "active"').catch(() => [[{ total: 0 }]]),
      pool.query('SELECT COUNT(*) as total, GROUP_CONCAT(name SEPARATOR ", ") as names FROM campaigns WHERE status = "active"').catch(() => [[{ total: 0, names: 'Sin campañas' }]]),
      pool.query('SELECT SUM(stock) as totalStock FROM campaign_batches WHERE status = "active"').catch(() => [[{ totalStock: 0 }]]),
      pool.query('SELECT COUNT(*) as total FROM vaccination_records WHERE status = "applied"').catch(() => [[{ total: 0 }]]),
      pool.query(`
        SELECT 
          ELT(MONTH(application_date), 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic') as name,
          COUNT(*) as vacunas 
        FROM vaccination_records 
        WHERE status = "applied" AND application_date IS NOT NULL
        GROUP BY MONTH(application_date), ELT(MONTH(application_date), 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic')
        ORDER BY MONTH(application_date) ASC
      `).catch(() => [[]])
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalPatients: patientsCount[0]?.total || 0,
          activeCampaignsCount: activeCampaigns[0]?.total || 0,
          activeCampaignsNames: activeCampaigns[0]?.names || 'Sin campañas activas',
          totalStock: vaccinesStock[0]?.totalStock || 0,
          totalApplied: appliedDoses[0]?.total || 0,
          sanitaryAlerts: {
            count: 1,
            text: 'Alerta: Monitoreo epidemiológico activo'
          }
        },
        chartData: monthlyAnalytics[0] || []
      }
    });
  } catch (error) {
    console.error('Error al obtener datos del Dashboard:', error);
    res.status(500).json({ success: false, message: 'Error en base de datos' });
  }
};