"use client";

export const Logout = () => {
  const handleGoogleLogout = () => {
    // handle google logout
  };

  return (
    <div className="flex flex-col w-96 h-48 rounded-2xl p-4 gap-10 bg-blue-400">
      <h1 className="text-white p-4 text-center text-lg">Logout Form</h1>
      <button
        onClick={handleGoogleLogout}
        className="text-white bg-zinc-950 rounded-xl p-4"
      >
        Click to Logout
      </button>
    </div>
  );
};
