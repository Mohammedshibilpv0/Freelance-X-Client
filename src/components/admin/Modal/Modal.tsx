import Loading from "../../../style/loading";

interface ModalField {
  label: string;
  type: 'text' | 'select';
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  options?: { label: string; value: string }[];
}

interface ModalProp {
  toggleModal: () => void;
  title: string;
  fields: ModalField[];
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  loading: boolean;
}

const Modal: React.FC<ModalProp> = ({ toggleModal, title, fields, onSubmit, loading }) => {
  return (
    <div>
      <div
        id="authentication-modal"
        tabIndex={-1}
        aria-hidden="true"
        className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full overflow-y-auto bg-gray-900 bg-opacity-50"
      >
        <div className="relative p-4 w-full max-w-md">
          <div className="relative bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between p-4 border-b rounded-t">
              <h3 className="text-xl font-semibold text-black">{title}</h3>
              <button
                type="button"
                onClick={toggleModal}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <div className="p-4">
              <form className="space-y-4" onSubmit={onSubmit}>
                {fields.map((field, index) => (
                  <div key={index}>
                    <label
                      htmlFor={field.name}
                      className="block mb-2 text-sm font-medium text-black"
                    >
                      {field.label}
                    </label>
                    {field.type === 'text' && (
                      <input
                        type={field.type}
                        name={field.name}
                        id={field.name}
                        value={field.value}
                        onChange={field.onChange}
                        className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    )}
                    {field.type === 'select' && field.options && (
                      <select
                        name={field.name}
                        id={field.name}
                        value={field.value}
                        onChange={field.onChange}
                        className="bg-gray-50 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      >
                        {field.options.map((option, index) => (
                          <option key={index} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                ))}
                <button
                  type="submit"
                  className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <Loading />
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
