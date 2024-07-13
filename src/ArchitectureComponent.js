import React from 'react';
import { ArrowRight, FileUp, Database, Table, CloudUpload } from 'lucide-react';

const Box = ({ children, className }) => <div className={className}>{children}</div>;
const Text = ({ children, className }) => <span className={className}>{children}</span>;
const Flex = ({ children, className }) => <div className={`flex ${className}`}>{children}</div>;


const ArchitectureComponent = () => {
  return (
    <Flex direction="column" align="center" className="p-4 bg-gray-100 rounded-lg">
      <Box className="bg-white p-4 rounded shadow-md mb-4">
        <Text className="font-bold text-lg mb-2">Frontend (React)</Text>
        <Flex align="center" className="mb-2">
          <FileUp className="mr-2" />
          <Text>Drag & Drop Interface</Text>
        </Flex>
      </Box>
      <ArrowRight className="mb-4" />
      <Box className="bg-white p-4 rounded shadow-md mb-4">
        <Text className="font-bold text-lg mb-2">Backend (Node.js + Express)</Text>
        <Flex align="center" className="mb-2">
          <Database className="mr-2" />
          <Text>File Processing & Analysis</Text>
        </Flex>
      </Box>
      <ArrowRight className="mb-4" />
      <Flex justify="space-between" className="w-full">
        <Box className="bg-white p-4 rounded shadow-md">
          <Text className="font-bold text-lg mb-2">Google Services</Text>
          <Flex align="center" className="mb-2">
            <Table className="mr-2" />
            <Text>Sheets API</Text>
          </Flex>
          <Flex align="center">
            <CloudUpload className="mr-2" />
            <Text>Drive API</Text>
          </Flex>
        </Box>
        <Box className="bg-white p-4 rounded shadow-md">
          <Text className="font-bold text-lg mb-2">n8n</Text>
          <Text>Workflow Automation</Text>
        </Box>
      </Flex>
    </Flex>
  );
};

export default ArchitectureComponent;