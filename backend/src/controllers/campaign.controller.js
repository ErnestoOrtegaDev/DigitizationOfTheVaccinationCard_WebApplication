import Campaign from "../models/campaign.model.js";
import { Op } from "sequelize";
export const createCampaign = async (req, res) => {
  try {
    const { healthCenter, address, dynamic, diseaseOutbreak, state, locality, vaccineId } = req.body;
    if (address && address.length > 246) {
      return res.status(400).json({ 
        status: "error", 
        message: "Address cannot exceed 246 characters." 
      });
    }

    const newCampaign = await Campaign.create({
      healthCenter,
      address,
      dynamic,
      diseaseOutbreak,
      state,
      locality,
      vaccineId
    });

    res.status(201).json({
      status: "success",
      message: "Campaign created successfully",
      data: newCampaign
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const getCampaigns = async (req, res) => {
  try {
    const { state, locality } = req.query;
    let whereClause = {};

    if (state) {
      whereClause.state = state;
    }

    if (locality) {
      whereClause.locality = { [Op.like]: `%${locality}%` }; // Búsqueda parcial por letras
    }

    const campaigns = await Campaign.findAll({ where: whereClause });

    res.status(200).json({
      status: "success",
      results: campaigns.length,
      data: campaigns
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};