interface DashboardPageContainerProps {}



export const DashboardPageContainer = ({
  children
}: React.PropsWithChildren<DashboardPageContainerProps>) => {
  return (
    <div className="relative px-9 py-6 pt-4 w-full">
      <div className="flex-1 gap-10 py-3.5 vertical">{children}</div>
    </div>
  );
};
