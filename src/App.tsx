import { ProgressNav } from "./components/ProgressNav";
import { useRouteFlow } from "./hooks/useRouteFlow";
import { WelcomePage } from "./pages/WelcomePage";
import { PersonalDetailsPage } from "./pages/PersonalDetailsPage";
import { GoalsPreferencesPage } from "./pages/GoalsPreferencesPage";
import { DietPreferencesPage } from "./pages/DietPreferencesPage";
import { SummaryPage } from "./pages/SummaryPage";
import { PlanGenerationPage } from "./pages/PlanGenerationPage";
import { WorkoutTrackingPage } from "./pages/WorkoutTrackingPage";
import { steps } from "./routes";
import { usePlannerStore } from "./state/usePlannerStore";

function App() {
  const { path, currentIndex, goBack, goNext } = useRouteFlow();
  const {
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
    markStepComplete(steps[currentIndex].id);
    goNext();
  };

  return (
    <main className="app">
      <div className="app-frame">
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
              onNext={completeAndNext}
            />
          ) : null}
          {path === "/plan" ? (
            <PlanGenerationPage
              profile={profile}
              plan={plan}
              preferences={preferences}
              savePlan={savePlan}
              selectMeal={selectMeal}
              onBack={goBack}
              onNext={completeAndNext}
            />
          ) : null}
          {path === "/tracking" ? (
            <WorkoutTrackingPage
              plan={plan}
              workoutLogs={workoutLogs}
              sessionRecords={sessionRecords}
              addWorkoutLog={addWorkoutLog}
              setSessionStatus={setSessionStatus}
              onBack={goBack}
            />
          ) : null}
        </div>
      </div>
    </main>
  );
}

export default App;
