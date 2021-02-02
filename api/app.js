const express = require('express');
const app = express();
const { mongoose} = require('./db/mongoose');
const bodyParser = require ('body-parser');
//load in mongoose models
const { WorkSpace } = require('./db/models/workspace.model');
const { ProjSpace } = require('./db/models/project.model');
const { TaskSpace } = require('./db/models/task.model');
const { SkillSpace } = require('./db/models/skill.model');
const { NotifSpace } = require('./db/models/notification.model');
//const { EmployeeSpace } = require('./db/models/employee.model');
//const { request } = require('express');
const { User } = require('./db/models/user.model');
const jwt = require('jsonwebtoken');
const { Collection } = require('mongoose');
//const e = require('express');


/** MIDDLEWARE */


//Load Middleware
app.use(bodyParser.json());

//Cors headers

app.use(function(req, res, next) {
   // req.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");

    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );

    next();
});


// check whether the request has a valid JWT access token
let authenticate = (req, res, next) => {
    let token = req.header('x-access-token');
    
    // verify the JWT
    jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
        if (err) {
            // there was an error
            // jwt is invalid - * DO NOT AUTHENTICATE *
            res.status(401).send(err);
        } else {
            // jwt is valid
            req.user_id = decoded._id;            
            next();
        }
    });
}

//Verify refresh tokens which will verify session.
let verifySession = ((req,res, next) => {
    //grab refresh token from header.
    let refreshToken = req.header('x-refresh-token');
    
    //grab _id from request header.
    let _id = req.header('_id');
  

    User.findByIdAndToken(_id, refreshToken).then((user) => {
        if (!user)
        {
            //user was not found.
            return Promise.reject({
                'Error': 'User was not found. Make sure user ID and refresh token are valid.'
            });
        }
        //User was found.
        req.user_id = user._id;
        req.userObject = user;
        req.refreshToken = refreshToken;

        let isSessionValid = false;

        user._Sessions.forEach((session) => {
            if (session.token === refreshToken)
            {
                //Check if session has expired.
                if (User.hasRefreshTokenExpired(session.expiresAt) === false)
                {
                    //refresh token has not expired.
                    isSessionValid = true;
                }
            }
        });
        if (isSessionValid)
        {
            //session is valid.
            next();
        }
        else
        {
            //session is not valid.
            return Promise.reject({
                'Error': 'Refresh token has expired or session is invalid.'
            });
        }
    }).catch((e) => {
        res.status(401).send(e);
    });
});

/** END MIDDLEWARE */

/* ROUTE HANDLERS */

/* ALL ROUTES */



app.get('/workspaces/:wrkId', authenticate, (req, res) => {
    //we want to return an array of all workspaces that belong to the authenticated user
       WorkSpace.findOne({
           //_userId: req.user_id
           _id: req.params.wrkId
        }).then((workspaces) => {
           res.send(workspaces);
       }).catch((e) => {
           res.send(e);
       });
   })
   

app.get('/skills', authenticate, (req, res) => {
    //GET skills in the database.
    SkillSpace.find({ }).then((skills) => {
        res.send(skills);
    }).catch((e) => {
        res.send(e);
    });
})

/*
app.get('/employees', (req, res) => {
    //GET employees in the database.
    EmployeeSpace.find({ }).then((employees) => {
        res.send(employees);
    }).catch((e) => {
        res.send(e);
    });
})
*/

app.get('/users', authenticate, (req, res) => {
    //GET users in the database.
    User.find().then((users) => {
        res.send(users);
        
    }).catch((e) => {
        res.send(e);
    });
})

app.get ('/users/:userId', (req, res)=> {
    User.findById({ 
        _id: req.params.userId
    }).then((user) => {
        res.send(user);
    }).catch((e) => {
        res.send(e);
    })
});

/*
app.get('/employees/:skillName', (req, res) => {
    //GET all employees with a particular skill.
        EmployeeSpace.find().or([
            { _Skill_Name_1: req.params.skillName },
            { _Skill_Name_2: req.params.skillName },
            { _Skill_Name_3: req.params.skillName }
        ]).then((employees) => {
            res.send(employees);
        }).catch((e) => {
            res.send(e);
        });
    });
*/

app.get('/users/skills/:skillName', authenticate, (req, res) => {
    //GET all employees with a particular skill.
    User.find().or([
        { _Skill_Name_1: req.params.skillName },
        { _Skill_Name_2: req.params.skillName },
        { _Skill_Name_3: req.params.skillName }
        ]).then((users) => {
            res.send(users);
        }).catch((e) => {
            res.send(e);
        });
    });

app.get ('/users/user/:pmId', (req,res)=> {
    User.findById({ 
        _id: req.params.pmId
    }).then((user) => {
        res.send(user);
    }).catch((e) => {
        res.send(e);
    })
    });

/**
 * GET /workspaces/:workspaceId/projects
 * Purpose: Get all Projects in a Workspace
 */
app.get('/workspaces/:workspaceId/projects', authenticate, (req, res) => {
    //We want to returnn a list of projects belonging to a workspace
    ProjSpace.find({ 
        _workspaceId: req.params.workspaceId
    }).then((projects) => {
        res.send(projects);
    }).catch((e) => {
        res.send(e);
    });
});


/**
 * Get /workspaces/:workspaceId/projects/:projectId/tasks
 * Purpose Get all tasks in a Project
 */

/* get all tasks from a project */    

app.get('/workspaces/:workspaceId/projects/:projectId/tasks', authenticate, (req, res) => {
    TaskSpace.find({
        _workspaceId: req.params.workspaceId,
        _projectId: req.params.projectId,
    }).or([{ _pmId: req.user_id }, { _supervisorId: req.user_id }, {_empId: req.user_id}]).then((tasks) => { 
        console.log(tasks);       
        res.send(tasks);
    }).catch((e) => {
        res.send(e);
    });
  
});

app.get('/workspaces/:workspaceId/projects/:projectId', authenticate, (req, res) => {
    //We want to return a particular project belonging to a workspace
        ProjSpace.findOne({ 
            _workspaceId: req.params.workspaceId,
            _id: req.params.projectId,
        }).then((project) => {
            res.send(project);
        }).catch((e) => {
            res.send(e);
        });
    });

//Get task by taskId

    
 app.get('/workspaces/:workspaceId/projects/:projectId/tasks/:taskId', authenticate, (req, res) => {
     TaskSpace.findOne({
         _workspaceId: req.params.workspaceId,
         _projectId: req.params.projectId,
         _id: req.params.taskId
     }).then((task) => {
        res.send(task);
     }).catch((e) => {
         res.send(e);
     });
   

});

app.post('/workspaces', authenticate,  (req, res) => {
   
    let _Work_Name = req.body.WorkName;
    let _Work_Desc = req.body.WorkDesc;
    let  _supervisorId = req.user_id;
    let newWorkspace = new WorkSpace({
        _Work_Name,
        _Work_Desc,
        _supervisorId
    });
    newWorkspace.save().then((wsDoc) => {
        //Full Workspace is returned.
        res.send(wsDoc);
    })
});

app.post('/skills', authenticate, (req, res) => {
    //POST new skill.
    let _Skill_Name = req.body.SkillName;
    let _Skill_Desc = req.body.SkillDesc;
    let newSkill = new SkillSpace({
        _Skill_Name,
        _Skill_Desc
    });
    newSkill.save().then((skDoc) => {
        //Full skill is returned.
        res.send(skDoc);
    })
});

/*
app.post('/employees', (req, res) => {
    //POST new employee
    let _Emp_Name = req.body.EmpName;
    let _Emp_Addr = req.body.EmpAddr;
    let _Emp_Phone = req.body.EmpPhone;
    let _Emp_Email = req.body.EmpEmail;
    let _Skill_Name_1 = req.body.SkillName1;
    let _Skill_Name_2 = req.body.SkillName2;
    let _Skill_Name_3 = req.body.SkillName3;
    let _Leave_StartDate = req.body.LSDate;
    let _Leave_EndDate = req.body.LEDate;
    let newEmployee = new EmployeeSpace({
        _Emp_Name,
        _Emp_Addr,
        _Emp_Phone,
        _Emp_Email,
        _Skill_Name_1,
        _Skill_Name_2,
        _Skill_Name_3,
        _Leave_StartDate,
        _Leave_EndDate
    });
    newEmployee.save().then((emDoc) => {
        res.send(emDoc);
    })
});
*/

app.post('/workspaces/:workspaceId/projects', authenticate, (req, res) => {
    // We want to create a new project in the workspace specifiedby the workspaceID 
    WorkSpace.findOne({
         _id: req.params.workspaceId,
        _supervisorId: req.user_id
    }).then((workspace) => {
        if(workspace) {
        //return true;
        console.log('Can create project in this workspace!!!');
        let _Proj_Name = req.body.ProjName;
        let _Proj_Desc = req.body.ProjDesc;
        let _Start_Date = req.body.StartDate;
        let _End_Date = req.body.EndDate;
        let _pmId = mongoose.Types.ObjectId();
        let _supervisorId = req.user_id;
           let newProject = new ProjSpace({
            _workspaceId: req.params.workspaceId,
            _Proj_Name,
            _Proj_Desc,
            _Start_Date,
            _End_Date,
            _pmId,
            _supervisorId        
        });
        newProject.save().then((pjDoc) => {
            //Full Project is returned.
            res.send(pjDoc);
        }).catch(e=>{
            console.log("Some Error->",e);
        })
    }
    else
    {
        res.sendStatus(403);
        //return false;
       // console.log('Cannot create project in this workspace!!!')
    }
    
})
    /*
    let _Proj_Name = req.body.ProjName;
    let _Proj_Desc = req.body.ProjDesc;
    let _Start_Date = req.body.StartDate;
    let _End_Date = req.body.EndDate;
    let _pmId = req.body.pmId;
    let _supervisorId = req.user_id;
       let newProject = new ProjSpace({
        _workspaceId: req.params.workspaceId,
        _Proj_Name,
        _Proj_Desc,
        _Start_Date,
        _End_Date,
        _pmId,
        _supervisorId        
    });
    newProject.save().then((pjDoc) => {
        //Full Project is returned.
        res.send(pjDoc);
    })*/
});

//We want to create a new task in the task form specified by the projectID associated with a workspaceID
    
app.post('/workspaces/:workspaceId/projects/:projectId/tasks', authenticate ,(req, res) => {
    //We want to create new task in the project specified by projectId , which is further specified by a workspace
    let user_id = req.user_id; 
    ProjSpace.findOne({
        _id: req.params.projectId,
        _workspaceId: req.params.workspaceId
    }).then((project)=> {
       // console.log(project);
        if ((user_id == project._supervisorId) || (user_id == project._pmId)){
            let _Task_Desc  = req.body.TaskDesc;
            let _Task_Name  = req.body.TaskName;
            let _Start_Date = req.body.StartDate;
            let _End_Date   = req.body.EndDate;
            let _Priority   = req.body.Priority;
            let _Attach_File = req.body.AttachFile;
            let _Comments   = req.body.Comments;
            let _empId = req.body.empId;
            let _Status     = req.body.Status;
            let _pmId = project._pmId;
            let _supervisorId = project._supervisorId;
                let newTask = new TaskSpace({
                    _workspaceId: req.params.workspaceId,
                    _projectId: req.params.projectId,
                    _Task_Desc,
                    _Task_Name, 
                    _Start_Date,
                    _End_Date,
                    _Priority, 
                    _Attach_File,
                    _Comments,  
                    _empId,
                    _Status,
                    _supervisorId,
                    _pmId
        });

            newTask.save().then((tsDoc) => {
            //Full Task is returned.
                 res.send(tsDoc);
                }).catch(e=>{
                    console.log("Some Error->",e);
                })
           
        }
        else {
            res.sendStatus(403);
        }

    })
 


    //TaskName, TaskDesc, StartDate, EndDate, Priority, Comments, EmpName, Status
  /*  
    let _Task_Desc  = req.body.TaskDesc;
    let _Task_Name  = req.body.TaskName;
    let _Start_Date = req.body.StartDate;
    let _End_Date   = req.body.EndDate;
    let _Priority   = req.body.Priority;
    let _Attach_File = req.body.AttachFile;
    let _Comments   = req.body.Comments;
    let _Emp_Name = req.body.EmpName;
    let _Status     = req.body.Status;
        let newTask = new TaskSpace({
            _workspaceId: req.params.workspaceId,
            _projectId: req.params.projectId,
            _Task_Desc,
            _Task_Name, 
            _Start_Date,
            _End_Date,
            _Priority, 
            _Attach_File,
            _Comments,  
            _Emp_Name,
            _Status 
        });

        newTask.save().then((tsDoc) => {
            //Full Task is returned.
            res.send(tsDoc);
        })
*/
});


app.patch('/workspaces/:id', authenticate,(req, res) => {
    //Update a workspace with new values specified in the JSON body of the request. Id of workspace will be in URL
    let _Work_Name = req.body.WorkName;
    let _Work_Desc = req.body.WorkDesc;
    WorkSpace.findOneAndUpdate({ _id:req.params.id , _supervisorId: req.user_id}, { $set: { _Work_Name , _Work_Desc } }).then(() => {
        res.sendStatus(200);
    })  
});

app.patch('/skills/:id', authenticate, (req, res) => {
    //PATCH a skill.
    let _Skill_Name = req.body.SkillName;
    let _Skill_Desc = req.body.SkillDesc;
    SkillSpace.findOneAndUpdate({ _id:req.params.id }, { $set: { _Skill_Name, _Skill_Desc } }).then(() => {
        res.sendStatus(200);
    })
});

/*
app.patch('/employees/:id', (req, res) => {
    //PATCH an employee
    let _Emp_Name = req.body.EmpName;
    let _Emp_Addr = req.body.EmpAddr;
    let _Emp_Phone = req.body.EmpPhone;
    let _Emp_Email = req.body.EmpEmail;
    let _Skill_Name_1 = req.body.SkillName1;
    let _Skill_Name_2 = req.body.SkillName2;
    let _Skill_Name_3 = req.body.SkillName3;
    let _Leave_StartDate = req.body.LSDate;
    let _Leave_EndDate = req.params.LEDate;
    EmployeeSpace.findByIdAndUpdate({ _id:req.params.id }, { $set: { _Emp_Name, _Emp_Addr, _Emp_Phone, _Emp_Email, _Skill_Name_1, _Skill_Name_2, _Skill_Name_3, _Leave_StartDate, _Leave_EndDate } }).then(() => {
        res.sendStatus(200);
    })
});
*/

// Patch Method for Projects in a a given workspace
app.patch('/workspaces/:workspaceId/projects/:projectId', authenticate, (req, res) => {
    let user_id = req.user_id;
   ProjSpace.findOne({
  
       _id: req.params.projectId ,
       _workspaceId: req.params.workspaceId
        }).then((project)=> {
            if ((user_id == project._supervisorId)) {
               // console.log(project._pmId);
               let _pmId = req.body.newpmId;
               let _Proj_Name = req.body.ProjName;
               let _Proj_Desc = req.body.ProjDesc;
               let _Start_Date = req.body.StartDate;
               let _End_Date = req.body.EndDate;
               let _Comments = req.body.Comments;
               ProjSpace.findOneAndUpdate({
                _id: req.params.projectId ,
                _workspaceId: req.params.workspaceId
                }, { $set: { _Proj_Name , _Proj_Desc , _Start_Date , _End_Date, _Comments, _pmId  } }).then(() => {
                res.send({'status': 'success'});
                //console.log(project);
            });
            }
            else {
                res.send(403);
            }
        })
    });
        
     
   //})//.then((workspace)=> {
        //if(workspace){
          //  console.log(workspace);
        //}
      //  console.log('cannot create project')
   // });
    
  
    
   
    /*
    //Update a prject  with new values specified in the JSON body of the request for the specified workspace. Id of project will be in URL
    let _Proj_Name = req.body.ProjName;
    let _Proj_Desc = req.body.ProjDesc;
    let _Start_Date = req.body.StartDate;
    let _End_Date = req.body.EndDate;
    let _Comments = req.body.Comments;
    ProjSpace.findOneAndUpdate({ 
        _id: req.params.projectId,
        _workspaceId: req.params.workspaceId

    }, { $set: { _Proj_Name , _Proj_Desc , _Start_Date , _End_Date, _Comments  } }).then(() => {
        //res.sendStatus(200);
    }) */ 
//}) ;


// Update a task with new values

app.patch('/workspaces/:workspaceId/projects/:projectId/tasks/:taskId', authenticate, (req, res) => {
    let user_id = req.user_id;

    TaskSpace.findOne({
        _id: req.params.taskId,
        _projectId: req.params.projectId,
        _workspaceId : req.params.workspaceId
    }).then((task) => {
        //console.log(task);

        if ((user_id == task._supervisorId)  || (user_id == task._pmId) || (user_id == task._empId)) {
            let _Task_Desc  = req.body.TaskDesc;
            let _Task_Name  = req.body.TaskName;
            let _Start_Date = req.body.StartDate;
            let _End_Date   = req.body.EndDate;
            let _Priority   = req.body.Priority;
            let _Attach_File = req.body.AttachFile;
            let _Comments   = req.body.Comments;
            let _empId = req.body.empId;
            let _pmId = req.body.pmId;
            let _supervisorId = req.body.supervisorId;
            let _Status = req.body.Status;
            TaskSpace.findOneAndUpdate({
                _workspaceId:  req.params.workspaceId,
                _projectId: req.params.projectId,
                _id: req.params.taskId
            }, { $set: {_Task_Desc, _Task_Name, _Start_Date, _End_Date, _Priority, _Attach_File, _Comments, _empId, _pmId, _supervisorId, _Status}} ).then(() => {
                res.send({"status": "success" });
            });
        } else {
            res.sendStatus(403);
        }

    })
    
    /*
    let _Task_Desc  = req.body.TaskDesc;
    let _Task_Name  = req.body.TaskName;
    let _Start_Date = req.body.StartDate;
    let _End_Date   = req.body.EndDate;
    let _Priority   = req.body.Priority;
    let _Attach_File = req.body.AttachFile;
    let _Comments   = req.body.Comments;
    let _Emp_Name = req.body.EmpName;
    let _Status     = req.body.Status;
    TaskSpace.findOneAndUpdate({
        _workspaceId:  req.params.workspaceId,
        _projectId: req.params.projectId,
        _id: req.params.taskId

    }, { $set: {_Task_Desc, _Task_Name, _Start_Date, _End_Date, _Priority, _Attach_File, _Comments, _Emp_Name, _Status}} ).then(() => {
        //res.sendStatus(200);
    }) */

});




app.delete('/workspaces/:id', authenticate,(req, res) => {
         // We want to delete the specified list (document with id in the URL)
        WorkSpace.findOneAndRemove({
            _id: req.params.id,
            _supervisorId:req.user_id
          
        }).then((removewsDoc) => {
            res.send(removewsDoc);   
            //delete all 
            
        });
    });


//Delete a project from a workspace based on its workspaceId and ProjectId
app.delete('/workspaces/:workspaceId/projects/:projectId', authenticate, (req, res) => {
    // We want to delete the specified list (document with id in the URL)
    let user_id = req.user_id;
    ProjSpace.findOne({
   
        _id: req.params.projectId ,
        _workspaceId: req.params.workspaceId
         }).then((project) => {
            if ((user_id == project._supervisorId) ) {
               // console.log(user_id);
                //console.log(project._supervisorId);
                //console.log(project._pmId);
                //console.log(_pmId);
                ProjSpace.findOneAndRemove({
                    _id: req.params.projectId,
                    _workspaceId: req.params.workspaceId  
                }).then((removepjDoc)=> {
                    res.send({'status': 'success'});  
                    //delete all the tasks that are in the deleted projects
                    deleteTasksFromProject(removepjDoc._id);
                })
            }
            else {
                res.sendStatus(403);
            }

         })




   /*
    ProjSpace.findOneAndRemove({
    _id: req.params.projectId,
    _workspaceId: req.params.workspaceId     
   }).then((removepjDoc) => {
       res.send(removepjDoc);          
    //delete all the tasks that are in the deleted projects
    deleteTasksFromProject(removepjDoc._id);

   })*/
});

//Delete a task from a project based on its workspaceId and ProjectId

app.delete('/workspaces/:workspaceId/projects/:projectId/tasks/:taskId', authenticate, (req, res) => {
    //We want to delete a specified task
    let user_id = req.user_id;
    TaskSpace.findOne({
        _id: req.params.taskId,
        _projectId: req.params.projectId,
        _workspaceId : req.params.workspaceId    
   }).then((task) => {

    if ((user_id == task._supervisorId)  || (user_id == task._pmId)) {
        TaskSpace.findOneAndRemove({
            _id: req.params.taskId,
             _projectId: req.params.projectId,
            _workspaceId : req.params.workspaceId
        }).then((removetsDoc)=> {
            res.send(200);  
        //delete all the tasks that are in the deleted projects
         
    
    })
    }
    else {
        res.sendStatus(403);
    }
});
});
   
   /*
    TaskSpace.findOneAndRemove({
        _workspaceId:  req.params.workspaceId,
        _projectId: req.params.projectId,
        _id: req.params.taskId
    }).then((removetsDoc) => {
        res.send(removetsDoc);
    });
*/


/* User Routes */
/**
 * POST /users
 * Purpose: user sign up.
 */
app.post('/users', (req, res) => {
    //User sign up.
    let body = req.body;
    let newUser = new User(body);

    newUser.save().then(() => {
        res.status(200).send("User Created!");
    }).then((refreshToken) => {
        //Session has been created. Return refreshToken.
        //Generate access auth token for user.
        return newUser.generateAccessAuthToken().then((accessToken) => {
            return {accessToken, refreshToken}
        });
    }).then((authToken) => {
        //Construct and send response to the user with their auth tokens in the header and user
        //object in the body.
        res
            .header('x-refresh-token', authToken.refreshToken)
            .header('x-access-token', authToken.accessToken)
            .send(newUser);
    }).catch((e) => {
        res.status(400).send(e);
    });
})

/**
 * POST /users/login
 * Purpose: login
 */
app.post('/users/login', (req, res) => {
    let _User_Name = req.body.username;
    let _Password = req.body.password;
    
    console.log(_User_Name+" - "+_Password);
    User.findByCredentials(_User_Name, _Password).then((user) => {
        console.log("Inside Credentials - "+_User_Name+" - "+_Password);
        return user.createSession().then((refreshToken) => {
            //Session has been created. Return refreshToken.
            //Generate access auth token for user.
            return user.generateAccessAuthToken().then((accessToken) => {
                return {accessToken, refreshToken}
            });
        }).then((authToken) => {
            res
                .header('x-refresh-token', authToken.refreshToken)
                .header('x-access-token', authToken.accessToken)
                .send(user);
        })
    }).catch((e) => {
        res.status(400).send(e);
    });
})

/**
 * GET /users/me/access-token
 * Purpose: generates and returns access token
 */
app.get('/users/me/access-token', verifySession, (req, res) => {
    //user is already authenticated.
    //user._id and userObject are now available.
    req.userObject.generateAccessAuthToken().then((accessToken) => {
        res.header('x-access-token', accessToken).send({ accessToken });
    }).catch((e) => {
        res.status(400).send(e);
    })
})

/*Helper Mthods */
let deleteTasksFromProject = (_projectId) => {
    TaskSpace.deleteMany({
        _projectId
    }).then(()=> {
        console.log("Tasks from" +_projectId+ "were deleted");
    })
}

/**
 * GET all tasks, irrespective of workspace or project
 */
app.get('/tasks', authenticate, (req, res) => {
    TaskSpace.find({ _empId: req.user_id }).then((tasks) => {
        //console.log(tasks);
        res.send(tasks);
    }).catch((e) => {
        res.send(e);
    });
})

app.get('/tasks/employee/:empId', authenticate, (req, res) => {

    TaskSpace.find().or([{ _empId: req.params.empId }, { _pmId: req.params.empId }, { _supervisorId: req.params.empId }]).then((tasks) => {
        //console.log(tasks);
        res.send(tasks);
    }).catch((e) => {
        res.send(e);
    });
})

/**
 * GET all projects, irrespective of workspace.
 */
app.get('/projects', authenticate, (req, res) => {
    ProjSpace.find().or([{ _pmId: req.user_id }, { _supervisorId: req.user_id }]).then((projects) => {
        //console.log(tasks);
        res.send(projects);
    }).catch((e) => {
        res.send(e);
    });
})

app.get('/projects/employee/:empId', authenticate, (req, res) => {

    ProjSpace.find().or([{ _pmId: req.params.empId }, { _supervisorId: req.params.empId }]).then((projects) => {
        //console.log(tasks);
        res.send(projects);
    }).catch((e) => {
        res.send(e);
    });
})

/**
 * GET 1 project by projectId.
 */
app.get('/projects/:projectId', authenticate, (req, res) => {
    ProjSpace.findOne({ _id: req.params.projectId }).then((projects) => {
        //console.log(tasks);
        res.send(projects);
    }).catch((e) => {
        res.send(e);
    });
})

/**
 * GET /workspaces
 * Purpose: Get all workspaces
 */

app.get('/workspaces', authenticate, (req, res) => {
    //we want to return an array of all workspaces that belong to the authenticated user
       WorkSpace.find({
           //_userId: req.user_id
           _supervisorId: req.user_id
        }).then((workspaces) => {
           res.send(workspaces);
       }).catch((e) => {
           res.send(e);
       });
   })

/////////////////

/**
 * Notifications using API calls
 */
app.post('/notifications' /*, authenticate*/, (req, res) => {
    let _pmId = req.body.pmId;
    let _supervisorId = req.body.supId;
    let _empId = req.body.empId;
    let _workspaceId = req.body.wrkId;
    let _projectId = req.body.projId;
    let _taskId = req.body.taskId;
    let _message = req.body.message;
    let newNotif = new NotifSpace({
        _pmId,
        _supervisorId,
        _empId,
        _workspaceId,
        _projectId,
        _taskId,
        _message
    });
    newNotif.save().then((notifDoc) => {
        //console.log(notifDoc);
        res.send(notifDoc);
    }).catch((e) => {
        res.send(e);
    })

});

app.get('/notifications', authenticate, (req, res) => {
    NotifSpace.find().or([{ _empId: req.user_id }, { _pmId: req.user_id }, { _supervisorId: req.user_id }]).then((notifs) => {
        res.send(notifs);
    }).catch((e) => {
        res.send(e);
    });
});

/////////////////

const server = app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});

/////////////////

/**
 * 
 * MongoDB Change Stream Configurations to monitor changes to database.
 * 
 */
const changeNotifStream = NotifSpace.watch();
changeNotifStream.on('change',(change)=>{
    //console.log(change.fullDocument);
    //notifChange(change.fullDocument);
});

/////////////////

/**
 * 
 * socket.io Configurations to monitor changes to database.
 * 
 */

/*
const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

function notifChange(change) {
    io.on('connection', function(socket){
        console.log(`user is connected ${socket.id}`);
    
        console.log(change);
        socket.emit('notif_change', change);
    
        //socket.emit('test event 2', data);
    
        socket.on('disconnect', () => {
            console.log('user is disconnected');
        });
    });
}
*/

/////////////////

/////////////////
