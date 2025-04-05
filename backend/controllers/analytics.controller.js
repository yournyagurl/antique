import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";



export const getAnalyticsData = async (req, res) => {
    const totalUsers = await User.countDocuments({});
    const totalProducts = await Product.countDocuments({});


    const salesData = await Order.aggregate([
        {
            $group: {
                _id: null,
                totalSales: { $sum:1 },
                totalRevenue: { $sum: "$totalAmount" },

            }
        }
    ]);

    const { totalSales, totalRevenue } = salesData[0] || {};

    return {
        users: totalUsers,
        products: totalProducts,
        sales: totalSales,
        revenue: totalRevenue
    }

}

export const getDailySalesData = async (startDate, endDate) => {
    const dailySales = await Order.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            }
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                totalSales: { $sum: 1 },
                totalRevenue: { $sum: "$totalAmount" }
            }
        },
        {
            $sort: { _id: 1 }
        }
    ]);

    const dateArray = getDatesInRange(startDate, endDate);
    console.log(dateArray);

    return dateArray.map(date => {
        const salesData = dailySales.find(item => item._id === date);
        return {
            date,
            totalSales: salesData ? salesData.totalSales : 0,
            totalRevenue: salesData ? salesData.totalRevenue : 0
        };
    });
}

function getDatesInRange(startDate, endDate) {
    const dates= [];
    let currentDate = startDate;

    while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
}

