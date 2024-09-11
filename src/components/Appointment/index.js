import React from "react";

import "components/Appointment/styles.scss";

import Header from "components/Appointment/Header";

import Empty from "components/Appointment/Empty";
import Show from "components/Appointment/Show";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import { useVisualMode } from "hooks/useVisualMode";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const CREATE = "CREATE";
  const SHOW = "SHOW";
  const EDIT = "EDIT";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";


  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
  
    transition(SAVING);
  
    props
      .bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(error => transition(ERROR_SAVE, true));
  }
  
  function destroy() {
    transition(DELETING, true);
    props
      .cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(error => transition(ERROR_DELETE, true));
  }
  


  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE) } />} 
      {mode === CREATE && <Form interviewers={props.interviewers} onCancel={back} onSave={save}/>}

      {mode === SAVING && <Status message={SAVING} />}

      {/* On initial render, fixture data will go through SHOW */}
      {mode === SHOW &&
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onEdit={() => transition(EDIT)}
          onDelete={() => transition(CONFIRM)}
        />  
      }

      {mode === EDIT && <Form  name={props.interview.student} interviewer={props.interview.interviewer.id} interviewers={props.interviewers}/>}
      {mode === CONFIRM && <Confirm onConfirm={destroy} onCancel={back} message={"Are you sure you want to delete?"} />}
      {mode === DELETING && <Status message={DELETING} />}
      {mode === ERROR_SAVE && <Error message="Could not book appointment." onClose={back}/>}
      {mode === ERROR_DELETE && <Error message="Could not cancel appointment." onClose={back}/>}
    </article>
  );
}
