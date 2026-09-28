import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';

export default function Layout() {
  return (
    <div className="h-full flex flex-col">
      <TopBar title="Workspace" />
      <Outlet />
    </div>
  );
}