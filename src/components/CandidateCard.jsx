import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CandidateCard({ candidate, onVote, disabled }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div onClick={() => setShowModal(true)} className="cursor-pointer bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-700 hover:scale-105 hover:shadow-xl transition duration-300">
        <img src={candidate.photo} alt={candidate.name} className="w-full h-40 object-cover rounded mb-3 border border-gray-700" />
        <h3 className="font-bold text-lg text-center text-white mb-2">{candidate.name}</h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onVote(candidate._id);
          }}
          disabled={disabled}
          className={`mt-auto w-full px-4 py-2 text-white rounded-md font-medium transition ${disabled ? 'bg-gray-500 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500'}`}
        >
          {disabled ? 'Voted' : 'Vote'}
        </button>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className="bg-gray-800 rounded-lg shadow-xl w-full max-w-3xl relative border border-gray-700 flex flex-col md:flex-row overflow-hidden"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <button className="absolute top-3 right-4 text-gray-300 hover:text-white text-2xl font-bold z-10" onClick={() => setShowModal(false)}>
                ✕
              </button>

              {/* Left: Image */}
              <div className="w-full md:w-1/2 max-h-[400px] min-h-[400px] overflow-hidden">
                <img src={candidate.photo} alt={candidate.name} className="w-full h-full object-cover" />
              </div>

              {/* Right: Details */}
              <div className="w-full md:w-1/2 p-6 flex flex-col justify-between max-h-[400px] min-h-[400px]">
                <div className="overflow-y-auto pr-2">
                  <h2 className="text-2xl font-bold mb-2 text-white">{candidate.name}</h2>
                  <p className="text-gray-300 text-sm leading-relaxed">{candidate.description}</p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => {
                      onVote(candidate._id);
                      setShowModal(false);
                    }}
                    disabled={disabled}
                    className={`w-full px-4 py-2 text-white rounded font-medium transition ${disabled ? 'bg-gray-500 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-500'}`}
                  >
                    {disabled ? 'Voted' : 'Vote'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
