import TaskList from "../components/TaskList.js";
import authHOCs from "../hoc/withAuth.js";

const { withAuth } = authHOCs;

const Home = () => {
  return (
    <section className="w-full flex-center flex-col">
      <TaskList />
    </section>
  );
};

export default withAuth(Home);
