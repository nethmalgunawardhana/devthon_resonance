// pages/create-research/basic-info.js
import Header from '@/components/header';
import Footer from '@/components/Footer';

export default function BasicInfo() {
  return (
    <div className="bg-[#f7f8fa] min-h-screen flex flex-col justify-between">
      <Header />

      <main className="flex justify-center py-10 px-4">
        <div className="bg-white w-full max-w-4xl rounded-md shadow-md p-8">
          {/* Step Navigation */}
          <div className="border-b border-gray-200 pb-4 mb-6 flex items-center gap-4 text-sm font-medium text-gray-600">
            <span className="text-red-600 font-semibold">Basic Information</span>
            <span className="text-green-600 font-semibold">7/12</span>
            <span>Advance Information</span>
            <span>Publish Research</span>
          </div>

          {/* Section Title */}
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>

          {/* Form */}
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Research Title</label>
                <input
                  type="text"
                  placeholder="Your course title"
                  className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Funding Goal</label>
                <input
                  type="text"
                  placeholder="Your research funding goal"
                  className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Research Category</label>
                <select className="w-full border border-gray-300 rounded-md p-3 text-sm bg-white focus:ring-red-500 focus:border-red-500">
                  <option>Select...</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Research Language</label>
                <select className="w-full border border-gray-300 rounded-md p-3 text-sm bg-white focus:ring-red-500 focus:border-red-500">
                  <option>Select...</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-between md:justify-end gap-4 mt-6">
              <button type="button" className="px-5 py-2 border border-gray-300 text-gray-600 rounded-md hover:bg-gray-100">
                Cancel
              </button>
              <button type="button" className="px-5 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200">
                Save
              </button>
              <button type="button" className="px-5 py-2 bg-red-200 text-red-800 rounded-md hover:bg-red-300">
                Save & Preview
              </button>
              <button type="submit" className="px-5 py-2 bg-red-700 text-white rounded-md hover:bg-red-800">
                Save & Next
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
