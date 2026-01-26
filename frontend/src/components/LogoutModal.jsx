import toast from "react-hot-toast";

const LogoutModal = ({ onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999]">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-[90%] max-w-sm">
        <h2 className="text-xl font-bold text-gray-800 text-center">
          Confirm Logout
        </h2>

        <p className="text-gray-600 text-center mt-2">
          Do you really want to logout?<br/>
          I'll miss you ☹️💔
        </p>
        

        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="w-1/2 py-2 rounded-xl border border-gray-300 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onConfirm();
              toast.success("Logged out successfully!");
            }}
            className="w-1/2 py-2 rounded-xl bg-red-500 text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
