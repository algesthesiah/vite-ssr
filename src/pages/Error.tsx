interface ErrorPageProps {
  status: number
  message: string
}

export default function ErrorPage(props: ErrorPageProps) {
  return (
    <div>
      <p className="text-center">
        {props.status} | {props.message}
      </p>
    </div>
  )
}
