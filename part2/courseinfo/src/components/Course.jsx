const Header = (props) => {
    return <h2>{props.name}</h2>
}

const Part = (props) => {
    return <p>
        {props.part.name} {props.part.exercises}
    </p>
}

const Content = (props) =>{
    return (
        <div>
            {props.parts.map(part => (
                <Part key={part.id} part={part} />    
            ))}
        </div>
    )
}

const Total = (props) => {
    const total = props.parts.reduce((sum, part) => sum+part.exercises, 0)
    return <p><strong>total of {total} exercises</strong></p>
}

const Course = (props) => {
    return(
        <div>
            <Header name={props.course.name} />
            <Content parts={props.course.parts} />
            <Total parts={props.course.parts} />
        </div>
    )
}

export default Course