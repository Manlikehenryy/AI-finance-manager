import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";

import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import SalesOverviewChart from "../components/overview/SalesOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesChannelChart from "../components/overview/SalesChannelChart";
import useGetStats from "../hooks/transactions/useGetStats";
import { useEffect } from "react";
import CardSkeleton, {
  GraphSkeleton,
} from "../components/skeletons/CardSkeleton";

const OverviewPage = () => {
  const { stats, getStats, loading } = useGetStats();

  useEffect(() => {
    getStats();
  }, []);

  return (
    <div className="flex-1 overflow-auto relative z-[1]">
      <Header title="Overview" />

      {!loading && stats && (
        <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
          {/* STATS */}
          <motion.div
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <StatCard
              name="This Week's Expenses Prediction"
              icon={Zap}
              value={`$${stats.currentWeekPrediction}`}
              color="#6366F1"
            />
             <StatCard
              name="Last Week's Expense"
              icon={BarChart2}
              value={`$${stats.lastWeekExpense}`}
              color="#6366F1"
            />
            <StatCard
              name="Total Transaction"
              icon={BarChart2}
              value={stats.totalTransactions}
              color="#8B5CF6"
            />
            
          </motion.div>

          {/* CHARTS */}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <SalesOverviewChart stats={stats} />
            <CategoryDistributionChart stats={stats} />
            <SalesChannelChart stats={stats} />
          </div>
        </main>
      )}

      {loading && (
        <div className="flex mt-10 overflow-x-hidden">
          {[...Array(4)].map((_, idx) => (
            <CardSkeleton key={idx} />
          ))}
        </div>
      )}

      {loading && (
        <div className="flex mt-10 overflow-x-hidden">
          {[...Array(2)].map((_, idx) => (
            <GraphSkeleton key={idx} />
          ))}
        </div>
      )}
    </div>
  );
};
export default OverviewPage;
