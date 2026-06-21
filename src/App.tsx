import { AppShell } from "./components/AppShell";
import { ProgressNav } from "./components/ProgressNav";
import { useRouteFlow } from "./hooks/useRouteFlow";
import { WelcomePage } from "./pages/WelcomePage";
import { PersonalDetailsPage } from "./pages/PersonalDetailsPage";
import { GoalsPreferencesPage } from "./pages/GoalsPreferencesPage";
import { DietPreferencesPage } from "./pages/DietPreferencesPage";
import { SummaryPage } from "./pages/SummaryPage";
import { PlanGenerationPage } from "./pages/PlanGenerationPage";
import { WorkoutTrackingPage } from "./pages/WorkoutTrackingPage";
import { DashboardPage } from "./pages/DashboardPage";
import { ProfilePage } from "./pages/ProfilePage";
import { onboardingSteps, isOnboardingPath } from "./routes";
import { usePlannerStore } from "./state/usePlannerStore";
import { generateWeeklyPlan } from "./lib/planGeneration";

function App() {
  const { path, currentIndex, navigate, goBack, goNext } = useRouteFlow();
  const {
    state,
    profile,
    plan,
    preferences,
    updateProfile,
    markStepComplete,
    savePlan,
    selectMeal,
    workoutLogs,
    sessionRecords,
    addWorkoutLog,
    setSessionStatus,
  } = usePlannerStore();

  const completeAndNext = () => {
    markStepComplete(onboardingSteps[currentIndex].id);
    goNext();
  };

  const completeOnboarding = () => {
    markStepComplete("summary");
    if (!plan) {
      savePlan(generateWeeklyPlan(profile, preferences));
    }
    navigate("/dashboard");
  };

  const appContent = (
    <div className="page-transition" key={path}>
      {path === "/dashboard" ? (
        <DashboardPage
          profile={profile}
          plan={plan}
          preferences={preferences}
          workoutLogs={workoutLogs}
          sessionRecords={sessionRecords}
          navigate={navigate}
        />
      ) : null}
      {path === "/plan" ? (
        <PlanGenerationPage
          profile={profile}
          plan={plan}
          preferences={preferences}
          savePlan={savePlan}
          selectMeal={selectMeal}
          onBack={() => navigate("/dashboard")}
          onNext={() => navigate("/tracking")}
        />
      ) : null}
      {path === "/tracking" ? (
        <WorkoutTrackingPage
          plan={plan}
          workoutLogs={workoutLogs}
          sessionRecords={sessionRecords}
          addWorkoutLog={addWorkoutLog}
          setSessionStatus={setSessionStatus}
          onBack={() => navigate("/plan")}
        />
      ) : null}
      {path === "/profile" ? (
        <ProfilePage
          state={state}
          profile={profile}
          preferences={preferences}
          updateProfile={updateProfile}
          savePlan={savePlan}
        />
      ) : null}
    </div>
  );

  return (
    <main className="app">
      <div className="app-frame">
        {isOnboardingPath(path) ? (
          <>
            <ProgressNav currentIndex={currentIndex} />
            <div className="page-transition" key={path}>
              {path === "/" ? (
                <WelcomePage
                  profile={profile}
                  updateProfile={updateProfile}
                  onNext={completeAndNext}
                />
              ) : null}
              {path === "/personal-details" ? (
                <PersonalDetailsPage
                  profile={profile}
                  updateProfile={updateProfile}
                  onBack={goBack}
                  onNext={completeAndNext}
                />
              ) : null}
              {path === "/goals" ? (
                <GoalsPreferencesPage
                  profile={profile}
                  updateProfile={updateProfile}
                  onBack={goBack}
                  onNext={completeAndNext}
                />
              ) : null}
              {path === "/diet" ? (
                <DietPreferencesPage
                  profile={profile}
                  updateProfile={updateProfile}
                  onBack={goBack}
                  onNext={completeAndNext}
                />
              ) : null}
              {path === "/summary" ? (
                <SummaryPage
                  profile={profile}
                  onBack={goBack}
                  onNext={completeOnboarding}
                />
              ) : null}
            </div>
          </>
        ) : (
          <AppShell path={path} navigate={navigate}>
            {appContent}
          </AppShell>
        )}
      </div>
    </main>
  );
}

export default App;
