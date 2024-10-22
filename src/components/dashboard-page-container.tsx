interface DashboardPageContainerProps {}

export const DashboardPageContainer = ({
  children
}: React.PropsWithChildren<DashboardPageContainerProps>) => {
  return (
    <div className="relative flex-1 px-4 pr-0 pt-6">
      <div className="size-full flex-1 gap-10 py-3.5 vertical">{children}</div>
    </div>
  );
};
