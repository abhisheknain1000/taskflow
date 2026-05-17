"use client";

import {
  useMemo,
  useState,
} from "react";

import { motion } from "framer-motion";

import {
  Shield,
  Users,
  BriefcaseBusiness,
} from "lucide-react";

import Topbar from "@/components/layout/topbar";

import StatsCard from "@/components/dashboard/stats-card";

import CreateTaskDialog from "@/components/task/create-task-dialog";

import TaskCard from "@/components/task/task-card";

import TaskSkeleton from "@/components/task/task-skeleton";

import { useTaskStore } from "@/store/task-store";

import { useAuthStore } from "@/store/auth-store";

export default function DashboardPage() {

  const user =
    useAuthStore(
      (state) => state.user
    );

  const {
    tasks,
    loading,
  } = useTaskStore();

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("all");

  const [currentPage, setCurrentPage] =
    useState(1);

  const TASKS_PER_PAGE = 6;

  const isAdmin =
    user?.role === "admin";

  const isManager =
    user?.role === "manager";

  const isMember =
    user?.role === "member";

  // FILTERS

  const filteredTasks =
    useMemo(() => {

      let filtered =
        [...tasks];

      // SEARCH

      filtered =
        filtered.filter(
          (task) =>
            task?.title
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              )
        );

      // COMPLETED

      if (
        filter ===
        "completed"
      ) {

        filtered =
          filtered.filter(
            (task) =>
              task.status ===
              "completed"
          );
      }

      // PENDING

      if (
        filter ===
        "pending"
      ) {

        filtered =
          filtered.filter(
            (task) =>
              task.status !==
              "completed"
          );
      }

      // ARCHIVED

      if (
        filter ===
        "archived"
      ) {

        filtered =
          filtered.filter(
            (task) =>
              task.archived
          );
      }

      // HIGH PRIORITY

      if (
        filter ===
        "high"
      ) {

        filtered =
          filtered.filter(
            (task) =>
              task.priority ===
              "high"
          );
      }

      return filtered;

    }, [
      tasks,
      search,
      filter,
    ]);

  // PAGINATION

  const totalPages =
    Math.ceil(
      filteredTasks.length /
        TASKS_PER_PAGE
    );

  const startIndex =
    (currentPage - 1) *
    TASKS_PER_PAGE;

  const paginatedTasks =
    filteredTasks.slice(
      startIndex,
      startIndex +
        TASKS_PER_PAGE
    );

  return (
    <motion.div className="
      flex-1
      flex
      flex-col
      bg-[#0B1020]
      text-white
      min-h-screen
    ">

        <Topbar />

        <div className="
          p-6
          lg:p-10
          space-y-8
        ">

          {/* HERO */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="
              rounded-3xl
              border
              border-white/10
              bg-gradient-to-r
              from-[#7C5CFF]/20
              to-cyan-500/10
              p-8
              backdrop-blur-xl
            "
          >

            <div className="
              flex
              items-center
              justify-between
              flex-wrap
              gap-6
            ">

              <div>

                <h1 className="
                  text-4xl
                  font-bold
                  tracking-tight
                ">
                  Welcome back,
                  {" "}
                  {user?.name}
                  👋
                </h1>

                <p className="
                  text-slate-300
                  mt-3
                  max-w-2xl
                  leading-relaxed
                ">
                  Manage tasks,
                  collaborate with teams,
                  and track project workflows.
                </p>
              </div>

              <div className="
                flex
                items-center
                gap-3
                px-5
                py-4
                rounded-2xl
                bg-white/5
                border
                border-white/10
              ">

                {isAdmin && (
                  <Shield className="text-red-400" />
                )}

                {isManager && (
                  <BriefcaseBusiness className="text-yellow-400" />
                )}

                {isMember && (
                  <Users className="text-cyan-400" />
                )}

                <div>

                  <p className="
                    text-sm
                    text-slate-400
                  ">
                    Logged in as
                  </p>

                  <p className="
                    font-semibold
                    capitalize
                  ">
                    {user?.role}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* STATS */}

          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-4
            gap-6
          ">

            <StatsCard
              title="Total Tasks"
              value={
                tasks.length.toString()
              }
            />

            <StatsCard
              title="Completed"
              value={
                tasks.filter(
                  (task) =>
                    task.status ===
                    "completed"
                ).length.toString()
              }
            />

            <StatsCard
              title="Pending"
              value={
                tasks.filter(
                  (task) =>
                    task.status !==
                    "completed"
                ).length.toString()
              }
            />

            <StatsCard
              title="Archived"
              value={
                tasks.filter(
                  (task) =>
                    task.archived
                ).length.toString()
              }
            />
          </div>

          {/* CREATE SECTION */}

          {(isAdmin || isManager) && (

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="
                rounded-3xl
                border
                border-white/10
                bg-white/5
                p-6
                backdrop-blur-xl
              "
            >

              <div className="
                flex
                items-center
                justify-between
                flex-wrap
                gap-6
              ">

                <div>

                  <h2 className="
                    text-2xl
                    font-bold
                  ">
                    Team Workspace
                  </h2>

                  <p className="
                    text-slate-400
                    mt-2
                  ">
                    Create tasks,
                    assign workflows,
                    and manage priorities.
                  </p>
                </div>

                {user && (
  <CreateTaskDialog
    user={user}
  />
)}
              </div>
            </motion.div>
          )}

          {/* SEARCH */}

          <div className="
            flex
            flex-col
            md:flex-row
            gap-4
          ">

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search tasks..."
              className="
                h-12
                w-full
                md:w-80
                rounded-2xl
                bg-[#121A2B]
                border
                border-white/10
                px-4
                text-white
                outline-none
                focus:border-[#7C5CFF]
              "
            />

            <select
              value={filter}
              onChange={(e) => {

                setFilter(
                  e.target.value
                );

                setCurrentPage(1);
              }}
              className="
                h-12
                rounded-2xl
                bg-[#121A2B]
                text-white
                border
                border-white/10
                px-4
                outline-none
              "
            >

              <option value="all">
                All Tasks
              </option>

              <option value="completed">
                Completed
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="archived">
                Archived
              </option>

              <option value="high">
                High Priority
              </option>
            </select>
          </div>

          {/* TASK GRID */}

          <div className="
            grid
            grid-cols-1
            md:grid-cols-2
            xl:grid-cols-3
            gap-6
          ">

            {loading &&
              Array.from({
                length: 6,
              }).map((_, i) => (
                <TaskSkeleton
                  key={i}
                />
              ))}

            {!loading &&
              paginatedTasks.map(
                (task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                  />
                )
              )}
          </div>

          {/* EMPTY */}

          {!loading &&
            paginatedTasks.length ===
              0 && (

              <div className="
                rounded-3xl
                border
                border-white/10
                bg-white/5
                p-14
                text-center
              ">

                <div className="
                  text-6xl
                ">
                  📋
                </div>

                <h2 className="
                  text-3xl
                  font-bold
                  mt-4
                ">
                  No Tasks Found
                </h2>

                <p className="
                  text-slate-400
                  mt-2
                ">
                  Try changing filters
                  or create a new task.
                </p>
              </div>
            )}

          {/* PAGINATION */}

          {!loading &&
            totalPages > 1 && (

              <div className="
                flex
                items-center
                justify-center
                gap-3
                pt-4
                flex-wrap
              ">

                <button
                  disabled={
                    currentPage === 1
                  }
                  onClick={() =>
                    setCurrentPage(
                      (prev) =>
                        prev - 1
                    )
                  }
                  className="
                    px-4
                    py-2
                    rounded-xl
                    bg-white/5
                    border
                    border-white/10
                    disabled:opacity-40
                  "
                >
                  Prev
                </button>

                {Array.from({
                  length: totalPages,
                }).map((_, index) => {

                  const page =
                    index + 1;

                  return (
                    <button
                      key={page}
                      onClick={() =>
                        setCurrentPage(
                          page
                        )
                      }
                      className={`
                        w-10
                        h-10
                        rounded-xl
                        transition-all
                        ${
                          currentPage ===
                          page
                            ? "bg-[#7C5CFF] text-white"
                            : "bg-white/5 border border-white/10"
                        }
                      `}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      (prev) =>
                        prev + 1
                    )
                  }
                  className="
                    px-4
                    py-2
                    rounded-xl
                    bg-white/5
                    border
                    border-white/10
                    disabled:opacity-40
                  "
                >
                  Next
                </button>
              </div>
            )}
        </div>
    </motion.div>
  );
}