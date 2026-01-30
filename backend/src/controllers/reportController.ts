import { Request, Response } from 'express';
import { Report } from '../models/reportModel';
import { validateReportInput, sanitizeInput, validatePagination } from '../utils/validators';
import { AuthRequest } from '../middlewares/roleMiddleware';

// Create a new price report
export const createReport = async (req: AuthRequest, res: Response) => {
  try {
    const { productName, price, unit, storeName, area } = req.body;

    // Validate input
    const validation = validateReportInput({
      productName,
      price,
      unit,
      storeName,
      area,
    });

    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors,
      });
    }

    // Create report
    const report = await Report.create({
      userId: req.userId,
      productName: sanitizeInput(productName),
      price: parseFloat(price),
      unit: unit.toLowerCase(),
      storeName: sanitizeInput(storeName),
      area: sanitizeInput(area),
      verificationMethod: 'manual',
      status: 'pending',
    });

    res.status(201).json({
      success: true,
      message: 'Report created successfully',
      data: report,
    });
  } catch (error: any) {
    console.error('Create report error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating report',
    });
  }
};

// Get user's own reports
export const getMyReports = async (req: AuthRequest, res: Response) => {
  try {
    const { page, limit } = validatePagination(
      req.query.page as string,
      req.query.limit as string
    );

    const skip = (page - 1) * limit;

    const reports = await Report.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Report.countDocuments({ userId: req.userId });

    res.status(200).json({
      success: true,
      data: reports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Get my reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reports',
    });
  }
};

// Get recent reports (last 5)
export const getRecentReports = async (req: AuthRequest, res: Response) => {
  try {
    const reports = await Report.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: reports,
    });
  } catch (error: any) {
    console.error('Get recent reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent reports',
    });
  }
};

// Delete a report
export const deleteReport = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const report = await Report.findOne({ _id: id, userId: req.userId });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found or unauthorized',
      });
    }

    await Report.deleteOne({ _id: id });

    res.status(200).json({
      success: true,
      message: 'Report deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting report',
    });
  }
};

// Get all reports (Admin/Verifier only)
export const getAllReports = async (req: AuthRequest, res: Response) => {
  try {
    const { page, limit } = validatePagination(
      req.query.page as string,
      req.query.limit as string
    );
    const status = req.query.status as string;

    const skip = (page - 1) * limit;
    const filter: any = {};

    if (status && ['pending', 'verified', 'flagged'].includes(status)) {
      filter.status = status;
    }

    const reports = await Report.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Report.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: reports,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Get all reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reports',
    });
  }
};

// Verify a report (Admin/Verifier only)
export const verifyReport = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['verified', 'flagged'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "verified" or "flagged"',
      });
    }

    const report = await Report.findByIdAndUpdate(
      id,
      {
        status,
        verifiedBy: req.userId,
        verifiedAt: new Date(),
      },
      { new: true }
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Report verified successfully',
      data: report,
    });
  } catch (error: any) {
    console.error('Verify report error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying report',
    });
  }
};