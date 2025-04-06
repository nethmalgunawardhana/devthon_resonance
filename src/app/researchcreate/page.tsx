'use client'
import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Navbar from '@/components/Navbar';
import Footer from '@/components/footer';
import dynamic from 'next/dynamic';

// Dynamically import ResearchCreate with no SSR
const ResearchCreate = dynamic(
  () => import('@/components/research/ResearchCreate'),
  { ssr: false }
);


const CreateResearchPage: NextPage = () => {
    return (
        <div className="bg-white">
            <Head>
                <title>Create Research</title>
                <meta name="description" content="Create your research project" />
            </Head>
            <Navbar />
            <div className="pt-18">
                <ResearchCreate />
            </div>
            <Footer />
        </div>
    );
}

export default CreateResearchPage;