import { Report } from '../models/reportModel';

export const calculateUserStats = async (userId: string) => {
  try {
    const totalReports = await Report.countDocuments({ userId });

    const statusCounts = await Report.aggregate([
      { $match: { userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const statusMap: any = { pending: 0, verified: 0, flagged: 0 };
    statusCounts.forEach((item) => { statusMap[item._id] = item.count; });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentReports = await Report.countDocuments({
      userId,
      createdAt: { $gte: sevenDaysAgo },
    });

    const topProducts = await Report.aggregate([
      { $match: { userId } },
      { $group: { _id: '$productName', count: { $sum: 1 }, avgPrice: { $avg: '$price' } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    return {
      totalReports,
      verifiedReports: statusMap.verified,
      pendingReports: statusMap.pending,
      flaggedReports: statusMap.flagged,
      recentActivity: recentReports,
      topProducts: topProducts.map((p) => ({
        name: p._id,
        count: p.count,
        avgPrice: Math.round(p.avgPrice * 100) / 100,
      })),
    };
  } catch (error) {
    throw new Error('Error calculating user stats');
  }
};

export const getPriceAlerts = async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const priceData = await Report.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          status: { $in: ['verified', 'pending'] }, // include pending too
        },
      },
      {
        $group: {
          _id: {
            product: '$productName',
            area: '$marketName', 
          },
          prices: { $push: { price: '$price', date: '$createdAt' } },
          avgPrice: { $avg: '$price' },
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          count: { $gte: 2 }, 
        },
      },
    ]);

    const alerts: any[] = [];

    priceData.forEach((item) => {
      const prices = item.prices.sort(
        (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );

      if (prices.length >= 2) {
        const oldPrice = prices[0].price;
        const newPrice = prices[prices.length - 1].price;
        const change = ((newPrice - oldPrice) / oldPrice) * 100;

        if (Math.abs(change) > 10) {
          alerts.push({
            product: item._id.product,
            area: item._id.area,
            oldPrice: Math.round(oldPrice * 100) / 100,
            newPrice: Math.round(newPrice * 100) / 100,
            change: Math.round(change * 100) / 100,
            type: change > 0 ? 'increase' : 'decrease',
            severity: Math.abs(change) > 20 ? 'high' : 'medium',
          });
        }
      }
    });

    return alerts.sort((a, b) => Math.abs(b.change) - Math.abs(a.change));
  } catch (error) {
    throw new Error('Error calculating price alerts');
  }
};

export const getProductTrends = async (productName: string, area?: string) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const match: any = {
      productName: new RegExp(productName, 'i'),
      createdAt: { $gte: thirtyDaysAgo },
      status: { $in: ['verified', 'pending'] }, 
    };

    if (area) {
      match.marketName = new RegExp(area, 'i');
    }

    const trends = await Report.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.date': 1 } },
    ]);

    return trends.map((t) => ({
      date: t._id.date,
      avgPrice: Math.round(t.avgPrice * 100) / 100,
      minPrice: Math.round(t.minPrice * 100) / 100,
      maxPrice: Math.round(t.maxPrice * 100) / 100,
      reportCount: t.count,
    }));
  } catch (error) {
    throw new Error('Error calculating product trends');
  }
};