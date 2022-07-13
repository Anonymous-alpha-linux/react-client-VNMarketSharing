import React from 'react';

function CRUDContainer({ headingText = null, dataHeading = ['ID', 'Name'], dataBody = [[1, 'Girl'], [2, 'Man']], options = {
    pagination: {
        pageWeight: 3
    }
} }) {

    // function createNewRecord(record) {
    //     dataBody.push(record);
    // }
    // function readRecord(filter) {

    // }
    // function updateRecord(filter, newRecord) {

    // }
    // function deleteRecord(filter) {

    // }
    // function validateHeading() {

    // }
    // function pagination(pageWeight) {
    //     if (dataBody.length % pageWeight === 0) return dataBody.length / pageWeight;
    //     return dataBody.length / pageWeight + 1;
    // }



    return (
        <div className='CRUD_container'>
            <h1>{headingText}</h1>

            <button>Create</button>
            <button>Read</button>
            <button>Update</button>
            <button>Delete</button>

            <table>
                <thead>
                    <tr>
                        {dataHeading.map((headingText, index) => <th key={index}>{headingText}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {
                        dataBody.map((bodyRecord, index) => <tr key={index}>
                            {bodyRecord.map((bodyText, index) => <td key={index}>{bodyText}</td>)}
                        </tr>)
                    }
                </tbody>
                <tfoot>
                    <tr>
                        {dataBody.map((_, index) => <td key={index}>{index + 1}</td>)}
                    </tr>
                </tfoot>
            </table>
        </div>
    )
}

export default CRUDContainer;