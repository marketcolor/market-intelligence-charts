import { useRef } from 'react'

import { FileUpload, type FileUploadFilesEvent } from 'primereact/fileupload'

export default function UploadPanel({ handleUpload }: { handleUpload: Function }) {
	const fileUploadRef = useRef(null)

	const uploadHandler = (e: FileUploadFilesEvent) => {
		handleUpload(e.files)
	}

	const emptyTemplate = () => {
		return (
			<div className='empty-template'>
				<i className='pi pi-table upload-icon'></i>
				<span className='upload-text'>...or Drag and Drop Data File Here</span>
			</div>
		)
	}

	return (
		<div className='upload-panel'>
			<FileUpload
				ref={fileUploadRef}
				name='data-upload'
				accept='text/csv'
				maxFileSize={1000000}
				chooseLabel='Chose data file'
				customUpload={true}
				uploadHandler={uploadHandler}
				auto={true}
				emptyTemplate={emptyTemplate}
			/>
		</div>
	)
}
