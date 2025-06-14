
type Props = { onLogin: () => void };

export default function LoginButton({ onLogin }: Props) {
  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onLogin();
      }}
      className="flex flex-col gap-2 items-center w-full"
    >
      <input
        type="password"
        required
        placeholder="Enter password"
        className="rounded px-4 py-2 border w-60 mb-2 shadow"
        aria-label="Password"
      />
      <button
        type="submit"
        className="bg-primary text-primary-foreground px-5 py-2 rounded hover:scale-105 transition"
      >
        Login
      </button>
    </form>
  );
}
