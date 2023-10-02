import { Fragment } from 'react';

export default function ResultTable({data}) {

    return (
     
      
            <table className='bg-white w-9/12 m-auto mt-20 text-responsive md:text-base'>
              <thead>
                <tr>
                  <th className='border-2 border-gray-800' >Category</th>
                  <th className='border-2 border-gray-800'>Areas for Improvement</th>
                  <th className='border-2 border-gray-800'>Grade</th>
                </tr>
              </thead>
              <tbody className='overflow-y-auto h-36'>
                {data.map((entry, index) => {
                  const key = Object.keys(entry)[0];
                  const value = entry[key];
                  return (
                    <Fragment key={index}>
                      {value.map((item, subIndex) => (
                        <tr key={subIndex}>
                          <td className='border-2 border-gray-800 p-2 align-top'>{key}</td>
                          <td className='border-2 border-gray-800 p-2 align-top'>{item['Areas for Improvement']}</td>
                          <td className='border-2 border-gray-800 p-2 align-top'>{item['Grade']}</td>
                        </tr>
                      ))}
                    </Fragment>
                  );
                })}
              </tbody>
            </table> 
          );
};

    