# Hands-On Docker

Other links:

* [Pre-requisites](https://github.com/alexellis/dockerlabs/)
* [Supporting blog article](http://blog.alexellis.io/dockerlabs/)

## Before we start

If you have a Windows or Mac laptop, then you will need to install the Docker toolbox before continuing. This package installs [Oracle VirtualBox](https://www.virtualbox.org) along with a tiny Linux virtual machine called *boot2docker*. The *boot2docker* ISO is around 32MB and VirtualBox will provision a hard drive of around 20GB - this should be plenty for the labs.

If you are running on Linux:
* Head over to the [Docker homepage](http://www.docker.com) and follow the instructions to install the latest version of the package directly on your system.

## Lab 1
### Check that everything's OK

#### You're on a Mac
On a Mac you will use the docker-machine tool to start up the *boot2docker* image and then point the docker client to it through environmental variables.

```
# docker-machine start default
```

Now that the virtual machine has been started we can point the docker client to the remote daemon:

```
# eval "$(docker-machine env default)"
```

Running `docker-machine env default` will give you key information about the remote daemon, and `docker-machine ip default` will show you the IP address of the virtual machine. This will be useful for accessing services running within the machine later on.

#### You're on Windows
If you are on Windows, then make sure that virtualization is enabled in your BIOS. After this find the *Docker Quickstart Terminal* shortcut and launch it.

```
Detecting the provisioner...
Copying certs to the local machine directory...
Copying certs to the remote machine...
Setting Docker configuration on the remote daemon...



                        ##         .
                  ## ## ##        ==
               ## ## ## ## ##    ===
           /"""""""""""""""""\___/ ===
      ~~~ {~~ ~~~~ ~~~ ~~~~ ~~~ ~ /  ===- ~~~
           \______ o           __/
             \    \         __/
              \____\_______/

docker is configured to use the default machine with IP 192.168.99.100
For help getting started, check out the docs at https://docs.docker.com
```

The Quickstart Terminal in your *Start menu* will use the `docker-machine` command to configure and start a new Virtual Machine running boot2docker. If you prefer to use an enhanced terminal over Windows' `cmd` then you can install Git for Windows 64-bit version. MiniGW-64 will be installed which adds better copy/paste support and TrueType Fonts.

You can now use the `docker-machine` and `docker` commands.

#### You're on Linux

Ignore any references to `docker-machine` in the instructions. You can use the `docker` client/command-line directly.

The IP address for accessing websites etc with be `localhost` or whatever address has been assigned to your network card.

## Lab 2
### Finding images on the Docker Hub

Docker provides a cloud service called *Hub* where you can pull (download) images without having an account or signing-in. You can also freely push (upload) images that you have created on your local machine. You can even link the Hub to Github to create automated builds for your projects.

Some of the images available are marked as 'Official' which means that they have been produced by a software vendor through an automated script. I would be weary of using images from unknown/unverified sources since they could contain malicious code.

Image can be starred through an account on the Docker Hub webpage, it's a good indication of how popular an image is and is used to rank the search results.

**Busybox** is a minimal set of Linux command line utilities compiled into a single small binary. Let's see if we can find the image in the Hub.

```
$ docker search busybox
NAME                           DESCRIPTION                                     STARS  OFFICIAL   AUTOMATED
busybox                        Busybox base image.                             554    [OK]
progrium/busybox                                                               59                [OK]
radial/busyboxplus             Full-chain, Internet enabled, busybox made...   8                 [OK]
odise/busybox-python                                                           3                 [OK]
multiarch/busybox              multiarch ports of ubuntu-debootstrap           2                 [OK]
azukiapp/busybox               This image is meant to be used as the base...   2                 [OK]
peelsky/zulu-openjdk-busybox                                                   1                 [OK]
...
```

In this example there is an official image available with a relatively high star count.

**Truncated output**

All docker commands are truncated to the width of your screen, if you want to see the full output, then pass `--no-trunc=true` as a parameter:

```
docker search --no-trunc=true mongo
```

## Lab 3
### Pulling an image and running it

*learnyounode* is a interactive coding tutorial produced by [nodeschool](http://nodeschool.io) for learning Node.js. It is normally installed through Node's package manager (npm) as a software package, before being run through the `learnyounode` command. This traditional installation requires that you have Node.js installed on your local system, but we will pull a public image down from the Hub and use that instead.

Traditional installation:

```
$ npm install -g learnyounode
$ learnyounode
```

Using Docker:

* At the prompt, type in `docker search alexellis2` and see which images matched the search.
* Use the `docker pull` command to download the correct image to your Docker host.
* Once the download is complete, take a look at the local image library with `docker images`.

**Running the image**

To run the image, type in the following:

`docker run -t alexellis2/learnyounodedocker`

Breaking it down:
* `run` looks up the image name to check if it exists in the host's library, if not it will attempt to pull it down from the Hub

* `-t` connects your keyboard to the container, most containers are not designed to be run at the console, but in the background as services or daemons.

After getting this working, see if you can print out the instructions for the first exercise by passing the argument `"HELLO WORLD"` (include quotes) to the previous command.

**Note: There is no need to go on and try to solve the problem, we just want to print the instructions out to show the module is being executed in a container.**

See also: [Dockerfile](https://github.com/alexellis/learnyounodedocker) for alexellis2/learnyounodedocker

## Lab 4
### Designing a Dockerfile for a web-server (hello_node)

You have now pulled an image that someone else created and have run it. Let's go on to create our own image which can run a basic Node.js web server.

**Dockerfile**

The *Dockerfile* is synonymous with a *Makefile* in the UNIX world. It contains all the steps needed to build a particular image where each step is run in ahead of time. The first line of the file must always be a `FROM` instruction which tells Docker what image to use as a basis. Dockerfiles can also be derived from a *scratch* image which provides a completely empty system. It won't have a shell or any utilities such as text editors. It is ideal for single, statically-linked binaries such as Docker Swarm.

Create a new directory and then use your favourite text editor to add `app.js`

* `mkdir hello_node`
* `cd hello_node`

**app.js**

```
var http = require('http');
http.createServer(function (req, res) {  
  console.log(new Date().toUTCString() + " - " + req.url);

  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello, Docker.\n');
}).listen(3000);

console.log('Server running at http://0.0.0.0:3000/');
```

Now we will design the Dockerfile.

**Dockerfile**

```
FROM mhart/alpine-node:4

ADD ./app.js /app.js
CMD ["/usr/bin/node", "/app.js"]
```

1. The `FROM` instruction is similar to the idea of extending a base class in Object-Orientated Programming, we start off with everything contained in that image, and can then add our changes on top as new layers.
2. The `ADD` instruction copies a file from our local filesystem into the container, in this instance we are adding a file to the root of the sytem.
3. The `CMD` instruction tells the image what instruction to start running when invoked with `docker run`

To build the `hello_node` image type in the following:

```
docker build -t hello_node .
```

* The parameter `-t` tags the image with a name and optional version. If you miss this out the command will still work, but you will have to identify your image by a GUID - or tag it after the build has completed.
* The `.` indicates the directory where the Dockerfile can be found and is always required.

If a build succeeds then a new image will be found in the host's library, check this with `docker images`.

**Note: Every time you alter a file used in the image, or the Dockerfile itself, you must run `docker build` again for the changes to take effect.**

## Lab 5
### Virtual size

During the build operation each line in our Dockerfile is run in a new container based upon all the previous steps in the file starting with the base image.

We are now going to find out the virtual size of our image. The term is referred to as *virtual* because our image only contains the new changes we made through our Dockerfile instructions. We will use the `docker history` command for this which also shows how long ago each step was run. Our steps will be very recent, but the base image's steps could have been run days or even weeks ago.

Some software vendors/projects such as Mono, Jenkins and Node.js have opted to ship their software on top of the Ubuntu or Debian Linux distribution. The base size of these images is going to start off in the 200-600MB range. Often steps have been taken to minify the system by removing unnecessary tools such as text editors (vim/nano), system utilities (curl/wget) and man pages.

```
REPOSITORY          TAG                 IMAGE ID            CREATED             VIRTUAL SIZE
jenkins             latest              974275304ab5        12 days ago         708.7 MB
node                0.12.9              e02d3f07356a        3 months ago        636.7 MB
mono                3.12.0-onbuild      9e1325621d99        12 days ago         348.5 MB
ubuntu              latest              c4bea91afef3        10 weeks ago        187.9 MB
```

Find out how many bytes we added to the base image through the following command: `docker history hello_node`.

If you would like to see more detail then pass `--no-trunc=true` as a parameter.

See also: [Best practises for writing Dockerfiles](https://docs.docker.com/engine/articles/dockerfile_best-practices/)

## Lab 6
### Running the hello_node and connecting from a browser

Now that we have built an image for the node web server (hello_node) we can test it in a web browser on our local machine. First, let's find out the IP address of the virtual machine before going any further.

```
# docker-machine ip default
192.168.99.100
```

Now we need to start the container, so type in:

`docker run -t -p 3000:3000 hello_node`

* `-t` will start the container and attach the keyboard, to close it hit *Control+C*
* `-p` provides a way of mapping the TCP port of the container to the host. Here port 3000 from the container is mapped to port 3000 on the host.

Open a web browser and point it to the IP address of the server using port *3000*

**Moving the container to the background**

Now let's run the container in the background *instead of on the console*, if you have not already stopped the container then hit *Control+C*.

Swap out `-t` (attach to console) for `-d` (run in background) and use `docker run` as below:

```
$ docker run -d -p 3000:3000 hello_node
59da83f693c7
```

You will notice part of a GUID is outputted, this is the ID of the container and can be used with a range of commands to check on the status of the container.

Stop the container

```
docker kill 59da83f693c7
```

Check the logs:

```
docker logs 59da83f693c7
```

Anything written to *stdout* or *stderr* will appear in the logs of a container. A trick some containers use is to create a symbolic link from their log file to stdout. This means you can check the status of an application without having to inspect its internal filesystem.  

## Lab 7
### Will it scale?

One of the benefits of using containers is that we can easily scale an application by running many instances of it at once. However, if you try to run two instances of *hello_node* then they will clash since port 3000 will already be in use on the Docker host.

There are two strategies available for avoiding port clashes - please try both before moving on.

**Static port mappings**

Change the host port to a different number, so instead of `-p 3000:3000`, we could have `3001:3000` and so on. The left hand side represents the host port, the right hand side is container's port. The container's port will never change but the host port can be anything within a valid range. So you would end-up with ports like *3001, 3002, 3003* etc.

**Dynamic port mapping**

In order to dynamically allocate a host port Docker will search for free ports starting at a high number like `30000` and then use this for the host port. It requires an 'EXPOSE' instruction in the Dockerfile for each port.

* Add the `EXPOSE 3000` instruction to the line before `CMD`
* Rebuild the image

```
# docker build -t hello_node .
# docker run -P -d hello_node
# docker ps
```

You can find the port mapping by typing `docker ps` i.e. `0.0.0.0:30123->3000/tcp or `docker port` followed by the container's ID.

Container IDs can be hard to work with, you can also assign a unique name to a container by passing --name to the `run` command such as:

```
# docker run -P -d --name hello_node1 hello_node
# docker run -P -d --name hello_node2 hello_node
...
```

## Lab 8
### Cleaning up

Disk space is allocated for each container we start up and that is not recovered even when the container is stopped or killed. That gives us the opportunity to inspect the filesystem or logs of the container, or to even restart it. Over time stopped containers can mount-up and go unnoticed because they no longer show up on the `docker ps` command.

* To find all containers currently running and stopped type in `docker ps -a`, `-q` can be passed to strip out everything apart from the GUIDs.

```
$ docker ps -aq
30490b7f4974
00bb8a59653d
9daf3be9e693
59da83f693c7
```

* `docker logs <containerid>` shows any output that was sent to STDOUT/STDERR

* You can go through each container and type `docker rm <id>`, but that could take some time. Bash scripting can provide a shortcut command:

`docker ps -aq | xargs docker rm -f`

* Once you have removed all the containers, `docker ps -a` will be empty:

```
CONTAINER ID        IMAGE               COMMAND             CREATED             STATUS
```

## Lab 9a
### .NET and Mono and xbuild

The [Mono project](http://www.mono-project.com/) by [Xamarian](https://xamarin.com/) provides a way to run .NET code on Windows, Mac and Linux (largely) without modification or porting. In this Lab we will take a sample application from the Git repository named HelloDocker and build it through xbuild, Mono's answer to msbuild.

We are going to use `mono:3.12.0-onbuild` as our base image, it is pre-loaded with all the dependencies we need and automatic instructions to add code from the current directory and build it. That means we don't have to issue any additional commands in the Dockerfile ourselves.

Enter the HelloDocker directory and issue a build command:

```
# cd hellodocker
# docker build -t hellodocker .
# docker run -t hellodocker
Hello Docker!
```

Change the message in Program.cs and run the above steps again.

See also: [Mono Dockerfile on GitHub](https://github.com/mono/docker)

## Lab 9b
### NuGet and NUnit

Mono supports both NuGet and NUnit which are often essential to continuous-integration in .NET

We will now use a sample solution called NuGetSample which:

* Installs NuGet packages
* Builds an executable and library used to give the product of two numbers
* And executes NUnit tests.

Our Dockerfile will derive from the same image as before, but we will issue and additional command to run NUnit after the `FROM` instruction. NuGet will be invoked automatically on our behalf.

```
FROM mono:3.12.0-onbuild
RUN ["mono", "/usr/src/app/source/packages/NUnit.Runners.2.6.4/tools/nunit-console.exe", "NuGetSampleLibrary.dll", "-nologo"]
CMD ["mono", "NuGetSample.exe"]
```

Invoke the build with `docker build -t nugetsample .`

```
Trigger 1, RUN nuget restore -NonInteractive
Step 0 : RUN nuget restore -NonInteractive
 ---> Running in 568b3ff46049
Installing 'NUnitTestAdapter.WithFramework 2.0.0'.
Installing 'NUnit.Runners 2.6.4'.
Successfully installed 'NUnitTestAdapter.WithFramework 2.0.0'.
Successfully installed 'NUnit.Runners 2.6.4'.
```

At this point one of the unit tests will fail due to a bug in `NuGetSampleLibrary.Tests.Multiply_Negatives_Test`, either comment out the test in the C# test file, or fix the bug to continue. Then build the image again.

We can now run the image we built with:

```
# docker run -t nugetsample
Usage: product x y
```

When we then go on to pass in x and y for instance: "4" and "5" we will get an error. This is because any text passed in after the image name will replace the *CMD* instruction and there is no binary found named "4" in the image. To get around this we need to alter the *CMD* instruction to *ENTRYPOINT* and rebuild the image.

```
ENTRYPOINT ["mono", "NuGetSample.exe"]

```

Once the image is rebuilt with *ENTRYPOINT*, then run the sample like this:

```
# docker run -t nugetsample 4 5
Product: 20
```

## Lab 10
### Persistence

Docker containers always start as an exact copy of their image - the image is read-only and cannot change. If we start up a container and run a shell - we could make any number of changes to the filesystem, but they will never be committed back to the image.

We have seen how to customise images by adding code or installing programs, but at some point a form of persistence is necessary. Let's take Docker itself as an example: it's official build method uses the currently installed Docker daemon to build a new version of the software and then copies it into a shared/mounted folder on the host.

In order to mount a host folder pass `-v /full/path/tohostfolder:/full/path/on/container` to the `docker run` command.

**Mounting a folder and saving a text file**

* We will create a folder called tmp in the current directory
* Run the container and mount tmp at: /tmp/mnt/
* Use cat to create a new file in the tmp folder (within the container)
* Exit the container, and then find the newly created file on our Docker client system.

If you are running on Windows, change `pwd` for the whole path to your folder: i.e.

```
-v //c/Users/Alex/Desktop/DockerLabs/tmp/:/tmp/mnt
```

Now run these steps:

```
# mkdir tmp
# ls tmp
# docker pull busybox
# docker run -v `pwd`/tmp:/tmp/mnt -ti busybox /bin/sh
```

Now within the container pipe some system information into sys.txt.

```
/ # uname -a > /tmp/mnt/sys.txt
/ # exit
```

Now on your Docker client system:

```
# ls tmp/
sys.txt
# cat sys.txt
Linux 3c3ba53430fd 4.1.13-boot2docker #1 SMP Fri Nov 20 19:05:50 UTC 2015 x86_64 GNU/Linux
```

There are several other ways of making changes persist: see [Managing data in containers](https://docs.docker.com/engine/userguide/dockervolumes/) for more information.

## Lab 11
### Container interaction

It is possible to use Docker containers as if they were virtual-machines and install all our software into one monolithic image - i.e. SCM, DB, code and logging tools etc.

A monolithic image could be slow to start, less portable and harder to maintain than separate containers with defined responsibilities. We can force a container to run several commands when starting up by pointing it at a shell script, but it is better practice to have a single executable in our *CMD* entry. What we will look at next is an example of how to get our DB and Web containers to talk to each other.

One option available is to start some services, find their ports with docker ps, then hard code in the addresses to the containers that are going to consume them. This does not scale well, but fortunately docker provides a linking mechanism to do all of this for us.

Let's start by running a redis DB and then add a Dockerfile for a node.js application that will increment a counter every time it is run.

* Redis is a light-weight key/value-pair database. Its official TCP port is 6379, run a named container by passing a new parameter of '--name'

`docker run -d --name redis_db -P redis`

* Add the following Dockerfile which installs the node-redis npm module and then executes app.js.

Dockerfile

```
FROM mhart/alpine-node:4

WORKDIR /root
RUN npm install node-redis
ADD ./app.js  ./app.js

CMD ["node", "app.js"]
```

app.js

```
var port = ?; var server = ?;
var client = redis.createClient(port, server);
```

Here we run into our first problem, how do we inject the IP address and port of the redis container?

The `docker run` command can be passed the parameter `--link`. This links the new container to one which is already running. Make sure the container we link to has been run with a `--name` parameter so we can reference it. The syntax is `--link already-running-container-name:some-alias`

Inside the new container we get two magic environmental variables:
* `$SOME_ALIAS_PORT_XXXX_TCP_ADDR`
* `$SOME_ALIAS_PORT_XXXX_TCP_PORT`.

These variables cannot be used directly in our app.js program, but node provides a mechanism for accessing environmental variables through `process.env.NAME`. i.e. `process.env.SOME_ALIAS_PORT_XXXX_TCP_ADDR`.

Our environmental variables are going to be:
```
$REDIS_DB_PORT_6379_TCP_ADDR
$REDIS_DB_PORT_6379_TCP_PORT
```

app.js (making use of process.env)

```
var redis = require ('node-redis')
var server = process.env.REDIS_DB_PORT_6379_TCP_ADDR;
var port = process.env.REDIS_DB_PORT_6379_TCP_PORT;
console.log("Connecting to " + server + ":" + port);
var client = redis.createClient(port, server);

var val = client.incr("hit_count", function(err, val) {
  console.log("hit_count "+ val);
  client.quit();
});
```

Build the image:

```
docker build -t node_redis .
```

We picked redis_db as the name of our redis container, so now let's run some instances of node_redis and link it:

```
# docker run --link redis_db:redis_db -t node_redis
Connecting to 172.17.0.3:6379
hit_count 1
# docker run --link redis_db:redis_db -t node_redis
Connecting to 172.17.0.3:6379
hit_count 2
# docker run --link redis_db:redis_db -t node_redis
Connecting to 172.17.0.3:6379
hit_count 3
```

See also: [Linking containers on docker.io](https://docs.docker.com/v1.8/userguide/dockerlinks/)

## Lab 12
### Persistence revisited with data containers

In addition to mounting a path/folder from our host into a container, we can also mount a path or folder from another container. The container providing storage is called a *data-container*. This is useful because it means we can share data between containers and easily swap our application image and keep the data-container unchanged, since it only contains the data and no application code.

It helps if a *data-container* derives from the same image as our application, so it has its main layers in common.

**1. Build the image_upload image**

Build the image_upload image from the image_upload folder. This will contain a web-server with an upload photo functionality, but the images will be stored in the data container.

The Dockerfile reveals that the code is added to /var/web/uploads.

```
$ cd image_upload
$ docker build -t image_upload .
```

**2. Build the image_upload_data image**

This will be the data-container where we store the images in /var/web/uploads.

```
# cd image_upload_data
# docker build -t image_upload_data .
```

Note the Dockerfile contains a new instruction:

```
VOLUME ["/var/web/uploads"]
```

**3. Create a data-container**

Instead of running a data-container like we have done in the other steps, we just create it and never start it. Any other container can mount its file-system with the `--volumes-from` parameter.

It is important that you do not delete this container or you will lose all updates stored within it.

```
# docker create --name image_upload_data1 image_upload_data /bin/true
```

**4. Start the image_upload container**

* Run the image_upload container
* Find the IP address of the container with `docker-machine ip default`
* Then navigate to the website on port 3000 and upload some photos.

* Running the container:
```
# docker run -d -p 3000:3000 --volumes-from image_upload_data1 --name image_upload1 image_upload
```

To make sure that the data-container is working properly, start another instance of the image on another port to see if the same pictures are displayed:

```
# docker run -d -p 3001:3000 --volumes-from image_upload_data1 --name image_upload2 image_upload
```

See also: [Manage data in containers](https://docs.docker.com/engine/userguide/dockervolumes/)
