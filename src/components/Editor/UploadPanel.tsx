import { Uploader } from 'rsuite'
import type { FileType } from 'rsuite/esm/Uploader'

export default function UploadPanel({ handleUpload }: { handleUpload: Function }) {
	const uploadHandler = (res: Response, file: FileType) => {
		handleUpload(file.blobFile)
	}

	return (
		<div className='upload-panel'>
			<Uploader
				name='data-upload'
				accept='text/csv'
				draggable
				autoUpload
				multiple={false}
				onSuccess={uploadHandler}
				action={''}
			>
				<div>
					<div className='upload-inner'>Click or Drag data file</div>
				</div>
			</Uploader>
		</div>
	)
}
