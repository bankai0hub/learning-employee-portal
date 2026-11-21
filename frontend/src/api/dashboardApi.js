import { getUsers } from "./userApi";
import { getPrograms } from "./programApi";
import { getRegistrations } from "./registrationApi";
import { getAssessments } from "./assessmentApi";
import { getFeedback } from "./feedbackApi";

export const getDashboardStats = async () => {
    try {
        const [usersData, programsData, registrationsData, assessmentsData, feedbackData] = await Promise.allSettled([
            getUsers(),
            getPrograms(),
            getRegistrations(),
            getAssessments(),
            getFeedback(),
        ]);

        const users = usersData.status === "fulfilled" ? (usersData.value?.users || usersData.value || []) : [];
        const programs = programsData.status === "fulfilled" ? (programsData.value?.programs || programsData.value || []) : [];
        const registrations = registrationsData.status === "fulfilled" ? (registrationsData.value?.registrations || registrationsData.value || []) : [];
        const assessments = assessmentsData.status === "fulfilled" ? (assessmentsData.value?.assessments || assessmentsData.value || []) : [];
        const feedback = feedbackData.status === "fulfilled" ? (feedbackData.value?.feedback || feedbackData.value || []) : [];

        const userList = Array.isArray(users) ? users : [];
        const programList = Array.isArray(programs) ? programs : [];
        const registrationList = Array.isArray(registrations) ? registrations : [];
        const assessmentList = Array.isArray(assessments) ? assessments : [];
        const feedbackList = Array.isArray(feedback) ? feedback : [];

        // Compute program status counts
        let activePrograms = 0;
        let completedPrograms = 0;
        let upcomingPrograms = 0;

        programList.forEach((p) => {
            const status = (p.status || "").toUpperCase();
            if (status === "ACTIVE" || status === "ONGOING") activePrograms++;
            else if (status === "COMPLETED" || status === "DONE") completedPrograms++;
            else upcomingPrograms++;
        });

        if (programList.length > 0 && activePrograms === 0 && completedPrograms === 0 && upcomingPrograms === 0) {
            activePrograms = programList.length;
        }

        // Compute assessment pass/fail counts
        let passCount = 0;
        let failCount = 0;

        assessmentList.forEach((a) => {
            const score = Number(a.score || 0);
            const maxScore = Number(a.max_score || a.maxScore || 100);
            const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
            if (percentage >= 50) passCount++;
            else failCount++;
        });

        if (assessmentList.length > 0 && passCount === 0 && failCount === 0) {
            passCount = assessmentList.length;
        }

        return {
            users: userList.length,
            programs: programList.length,
            registrations: registrationList.length,
            assessments: assessmentList.length,
            feedback: feedbackList.length,
            programChartData: [
                { name: "Active", value: activePrograms },
                { name: "Completed", value: completedPrograms },
                { name: "Upcoming", value: upcomingPrograms },
            ],
            assessmentChartData: [
                { result: "Pass", count: passCount },
                { result: "Fail", count: failCount },
            ],
        };
    } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        return {
            users: 0,
            programs: 0,
            registrations: 0,
            assessments: 0,
            feedback: 0,
            programChartData: [
                { name: "Active", value: 0 },
                { name: "Completed", value: 0 },
                { name: "Upcoming", value: 0 },
            ],
            assessmentChartData: [
                { result: "Pass", count: 0 },
                { result: "Fail", count: 0 },
            ],
        };
    }
};