import authRouter from "./auth.route";
import usersRouter from "./user.route";
import passport from "passport";
import organizationRoutes from "./organization.route";
import expenseRoutes from "./expense.route";
import incomeRoutes from "./income.route";

export const routes = (app: any) => {
  app.use("/api/auth", authRouter);
  app.use(
    "/api/users",
//     passport.authenticate("jwt", { session: false }),
    usersRouter
  );
  app.use(
    "/api/organizations",
//     passport.authenticate("jwt", { session: false }),
    organizationRoutes
  );
  app.use(
    "/api/expenses",
    // passport.authenticate("jwt", { session: false }),
    expenseRoutes
  );

        app.use(
        "/api/incomes",
        // passport.authenticate("jwt", { session: false }),
        incomeRoutes
        );

};
