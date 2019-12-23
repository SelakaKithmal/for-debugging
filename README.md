# To Reproduce

- `npm install` in project root
- Duplicate the `environments/environments.sample.ts` into a `environments/environments.prod.ts` and `environments/environments.ts` and update the contents in it appropriately
- `ng serve`
- On the register page `localhost:4200/auth/register`, try creating an account.

## What should happen (correct process)?

- On submit, Recaptcha (invisible) runs. If all checks out, a bottomsheet pulls up with input field to accept verification code sent to phone number.
- After entering phone number, bottomsheet should pass the code to the component that called the bottomsheet (in this case, the register component)
- The passing of the code to the register component is done via the `dismiss(...)` method on the bottomSheetRef
- The bottomsheet closes in the process. Register component continues from there

## What currently happens? (is it a bug?)

- On submit, recaptcha happens, bottomsheet comes up.
- After entering code, and continue button clicked, nothing happens, UNTIL user clicks somewhere else on the screen. Otherwise, nothing happens. The `dismiss(...)` doesn't work on its own.
