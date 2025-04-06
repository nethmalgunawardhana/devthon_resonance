import React from 'react';
import Image from 'next/image';
import { RxAvatar } from "react-icons/rx";
import CommentSection from './CommentSection';

const ContentSection = () => {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <span>Home</span>
            <span className="mx-2">›</span>
            <span>Applied Research</span>
            <span className="mx-2">›</span>
            <span>Medical Imagery</span>
            <span className="mx-2">›</span>
            <span>X-Ray</span>
          </div>
          
          <h1 className="text-2xl font-bold mb-4 text-[#1D2026]">Bone Fracture Detection Using Machine Learning in 3D X-ray Images</h1>
          
          <p className="text-gray-500 mb-6">
            This research aims to enhance the accuracy of fracture detection in 3D X-ray images using
            machine learning. Led by Dr. M. Perera, a renowned expert in machine vision, the project
            seeks funding and collaboration opportunities. We are looking for researchers specializing in
            3D image analysis and 3D object annotation to contribute to this groundbreaking work.
          </p>
          
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 rounded-full bg-gray-300 mr-3 overflow-hidden">
              <RxAvatar className="w-full h-full text-gray-500" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Lead by</div>
              <div className="font-medium text-[#1D2026]">Dr. M. Perera (University of Moratuwa) - Computer Vision</div>
            </div>
            <div className="ml-auto text-gray-500 text-sm">451,444 Views</div>
          </div>
        
        <div className="relative w-full h-100 bg-gray-200 mb-8 flex items-center justify-center">
          <Image src="/Trailer.png" alt="X-ray images showing bone fractures" 
                layout="fill" objectFit="cover" className="rounded" />
        </div>
        
        <div className="mb-8">
          <h3 className="font-semibold mb-2 text-[#770C0C]">Research Team</h3>
          <ul className="space-y-1 text-gray-700">
            <li>Dr. M. Perera (University of Moratuwa) - Computer Vision</li>
            <li>Dr. A. Fernando (Radiologist (MD) | Lecturer, University of Colombo)</li>
            <li>L. Silva (ML Engineer, ASV Research Group) - Computer Vision Expert</li>
            <li>D. S. Perera (IT Undergraduate, University of Moratuwa) - Computer Vision</li>
          </ul>
        </div>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-3 text-[#1D2026]">Description</h3>
          <p className="mb-4 text-gray-700">
            The goal of the research is to improve detecting fractures in 3D X-ray images. The research is headed by Dr. M. Perera a leading
            Computer Science researcher in the field of machine vision. We seek funding for this research and also looking for researchers in 3D
            image analysis, 3D object annotation.
          </p>
          <p className="text-gray-700">
            This research focuses on leveraging machine learning and deep learning techniques to detect bone fractures in 3D X-ray images.
            Traditional 2D X-ray analysis can miss subtle fractures, leading to misdiagnoses. By using advanced AI models trained on volumetric
            imaging data, this project aims to improve accuracy, automate fracture detection, and assist radiologists with faster and more reliable
            diagnoses.
          </p>
        </div>
        
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-[#1D2026] mb-3">Key Information</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Machine Learning & Deep Learning - CNNs, Vision Transformers (ViTs), 3D Convolutional Networks.</li>
            <li>Medical Imaging Techniques - DICOM processing, 3D reconstruction from X-rays.</li>
            <li>Frameworks & Tools - TensorFlow, PyTorch, OpenCV.</li>
          </ul>
        </div>
        
        <div className="mb-12">
          <h3 className="text-xl font-semibold mb-3 text-[#1D2026]">Collaboration Opportunities</h3>
          <p className="mb-3 text-gray-700">We are looking for more individuals to join us in this research. We are looking for:</p>
          <ul className="list-disc pl-5 space-y-2 text-gray-700">
            <li>Experience in Vision Transformers (ViTs)</li>
            <li>Computer Vision</li>
          </ul>
          <p className="mt-3 text-gray-700">
            Even if we have not listed a requirement, but you still you can help out feel free to join us.
          </p>
          <div className="mt-4">
            <button className="text-[#564FFD] text-sm font-semibold border-2 p-3 border-gray-200">Request To Collaborate</button>
          </div>
        </div>
        
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-[#1D2026] mb-5">About The Research Team</h3>
          
          <div className="flex mb-6 border p-6">
            <div className="w-16 h-16 rounded-full bg-purple-100 overflow-hidden mr-4 border border-gray-200">
              <RxAvatar className="w-full h-full text-gray-500" />
            </div>
            <div>
              <h4 className="font-medium text-[#1D2026]">Dr. M. Perera</h4>
              <p className="text-sm text-gray-600 mb-2">Senior Lecturer at University of Moratuwa | BSc in Engineering, MSc University of Peradeniya, PhD (University of Oxford, MIT)</p>
              <div className="flex items-center text-sm mb-2">
                <span className="text-gray-500 mr-1">Citations</span>
                <span className="font-medium mr-4 text-[#1D2026]">99</span>
                <span className="font-medium text-gray-500 mr-1">h-index</span>
                <span className=" text-[#1D2026]">7</span>
              </div>
            </div>
          </div>
        </div>

        <CommentSection />
      </div>
    </div>
  );
};

export default ContentSection;