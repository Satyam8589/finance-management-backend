import prisma from "../../lib/prisma.js";

const getSummary = async () => {
    const aggregations = await prisma.record.aggregate({
        where: { isDeleted: false },
        _sum: {
            amount: true
        }
    });

    const income = await prisma.record.aggregate({
        where: { type: 'income', isDeleted: false },
        _sum: { amount: true }
    });

    const expenses = await prisma.record.aggregate({
        where: { type: 'expense', isDeleted: false },
        _sum: { amount: true }
    });

    const totalIncome = income._sum.amount || 0;
    const totalExpenses = expenses._sum.amount || 0;

    return {
        totalIncome,
        totalExpenses,
        netBalance: totalIncome - totalExpenses
    };
};

const getCategoryTotals = async () => {
    const categories = await prisma.record.groupBy({
        by: ['category', 'type'],
        where: { isDeleted: false },
        _sum: {
            amount: true
        }
    });

    return categories.map(c => ({
        category: c.category,
        type: c.type,
        total: c._sum.amount
    }));
};

const getMonthlyTrends = async () => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const records = await prisma.record.findMany({
      where: {
        isDeleted: false,
        date: { gte: sixMonthsAgo }
      },
      select: {
        amount: true,
        type: true,
        date: true
      }
    });

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const trendsMap = {};

    records.forEach(record => {
      const d = new Date(record.date);
      const key = `${months[d.getMonth()]} ${d.getFullYear()}`;
      
      if (!trendsMap[key]) {
        trendsMap[key] = { month: key, income: 0, expense: 0 };
      }
      
      if (record.type === 'income') trendsMap[key].income += record.amount;
      else trendsMap[key].expense += record.amount;
    });

    return Object.values(trendsMap).sort((a, b) => {
        return new Date(a.month) - new Date(b.month);
    });
};

const getRecentActivity = async () => {
    return await prisma.record.findMany({
        where: { isDeleted: false },
        take: 5,
        orderBy: { date: 'desc' },
        select: {
            id: true,
            amount: true,
            type: true,
            category: true,
            date: true
        }
    });
};

export {
    getSummary,
    getCategoryTotals,
    getMonthlyTrends,
    getRecentActivity
};
