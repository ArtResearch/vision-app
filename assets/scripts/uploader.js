/**
 * Uploads image and get URL
 *
 * @class ImageUpload
 * @extends {HTMLElement}
 */
class ImageUpload extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._shadowRoot.innerHTML = `
    <h2 id="click-to-upload">Upload your image</h2>
    <div class="Upload-nice-button">
    <label for="file-upload" class="custom-file-upload">
    <div class="Uploader-div" style ="
        align-items: center;
    background-color: #ffffff;
    text-shadow: 0 0 1px rgb(0 0 0 / 38%);
    font-weight: 600;
    height: 31px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    color: #007bff!important;
    transition: 0.4s;
    font-size: medium;
    
    min-height: 4vh;
    border-radius: 4px;
    box-shadow: 0px 0px 10px 1px #bebebe;"> Choose your file</div>
    <div type="hidden" class="dropzone">
    <div  style="font-weight: bold;"class="info"></div>
    
    </label></div>
    </div>
    `;
    this.clientid = "9516b72594d77fc";
    this.endpoint = "https://api.imgur.com/3/image";
    this.dropzone = this._shadowRoot.querySelectorAll(".dropzone");
    this.info = this._shadowRoot.querySelectorAll(".info");

    function createEls(name, props, text) {
      var el = document.createElement(name),
        p;
      for (p in props) {
        if (props.hasOwnProperty(p)) {
          el[p] = props[p];
        }
      }
      if (text) {
        el.appendChild(document.createTextNode(text));
      }
      return el;
    }
    function insertAfter(referenceNode, newNode) {
      referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
    function post(that, path, data, callback) {
      
      var xhttp = new XMLHttpRequest();
      console.log("Client-ID " + that.clientid);
      xhttp.open("POST", path, true);
      xhttp.setRequestHeader("Authorization", "Client-ID " + that.clientid);
      xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
          console.log(this.status);
          if (this.status >= 200 && this.status < 300) {
            var response = "";
            try {
              response = JSON.parse(this.responseText);
            } catch (err) {
    
               response = this.responseText;
            }
            callback.call(that._shadowRoot, response);
          } else {
            
            callback.call(that._shadowRoot, response);
             throw new Error("yes - ya");
          }
        }
      };
      xhttp.send(data);
      xhttp = null;
    }
    function createDragZone(that) {
      var  input;
    
    
      input = createEls("input", {
        type: "file",
        id: "file-upload",
        multiple: "multiple",
        className: "file-upload",
        style: " display: none  !important;",
        accept: "image/*",
      });

    
      Array.prototype.forEach.call(
        that.dropzone,
        function (zone) {
          zone.appendChild(input);
          status(that, zone);
          upload(that, zone);
        }.bind(that)
      );
      
    }

    function status(that, el) {
      var div = createEls("div", { className: "status" });

      insertAfter(el, div);
    }

    function matchFiles(that, file, zone, fileCount) {
      var status = zone.nextSibling;

      if (file.type.match(/image/) && file.type !== "image/svg+xml") {
        status.classList.remove("bg-success", "bg-danger");
        status.innerHTML = "";

        var fd = new FormData();
        fd.append("image", file);
        post(
          that,
          that.endpoint,
          fd,
          function (data) {
            // if (fileCount[0] + 1 == fileCount[1]) {
            //   that._shadowRoot.classList.remove("loading");
            // }
            typeof that.callback === "function" &&
              that.callback.call(that, data);
          }.bind(that)
        );
      } else {
        status.classList.remove("bg-success");
        status.classList.add("bg-danger");
        status.innerHTML = "Invalid archive";
      }
    }

    function upload(that, zone) {
      var events = ["dragenter", "dragleave", "dragover", "drop"],
        file,
        target,
        i,
        len;

      zone.addEventListener(
        "change",
        function (e) {
          if (
            e.target &&
            e.target.nodeName === "INPUT" &&
            e.target.type === "file"
          ) {
            target = e.target.files;
            console.log(target.length);
            for (i = 0, len = target.length; i < len; i += 1) {
              file = target[i];
              matchFiles(that, file, zone, [i, target.length]);
            }
          }
        }.bind(this),
        false
      );

      events.map(function (event) {
        zone.addEventListener(
          event,
          function (e) {
            if (
              e.target &&
              e.target.nodeName === "INPUT" &&
              e.target.type === "file"
            ) {
              if (event === "dragleave" || event === "drop") {
                e.target.parentNode.classList.remove("dropzone-dragging");
              } else {
                e.target.parentNode.classList.add("dropzone-dragging");
              }
            }
          },
          false
        );
      });
    }

    function run(that) {
      // var loadingModal = that._shadowRoot.querySelector(".loading-modal");
      // if (!loadingModal) {
      //   loading(that);
      // }
      createDragZone(that);
    }

    function reportInfo(vars, showType = false) {
      if (showType === true) console.log(typeof vars);
      console.log(vars);
    }

    function addImg(that, ele, content) {
      console.log(ele);
      var myDIV = that._shadowRoot.querySelector(ele);
      var newContent = document.createElement("div");
      //[[> SearchImageFile]] me innerHTML

      newContent.innerHTML = content;

      while (newContent.firstChild) {
        myDIV.appendChild(newContent.firstChild);
      }
    }

    this.callback = function (res) {
      reportInfo(res, true);
      if (res.success === true) {
        var get_link = res.data.link.replace(/^http:\/\//i, "https://");
        this._shadowRoot.querySelector(".status").classList.add("bg-success");
        var content =
          "<form>Your selected image: " +
          '<input type="hidden" name="idhash" class="image-url" value="10f066701464ae9092702db94fc16ea1387b651d93685d4e1cb9b2090736965739f6794ed4ec8f48f1747c655ab03371ce0055dcd88e98fa689f8b9603f7dc27a0df68f42eab3651" />' +
          '<input type="hidden" name="uri" class="image-url" value="Default:Search" />' +
          '<input type="hidden" name="image" class="image-url" value="' +
          get_link +
          '"/>' +
          '<img class="img-to-upload"  style="height: 250px ;object-fit: contain; width: 100% !important; background: whitesmoke; padding: 8px 0px;" alt="Imgur-Upload" src="' +
          get_link +
          '"/>' +
          `<button type="submit" style=" align-items: center;background-color: #007bff;
              border-color: #007bff;
              text-shadow: 0 0 1px rgb(0 0 0 / 38%);
              font-weight: 600;
              height: 31px;
              cursor:pointer;
              display: flex;
              justify-content: center;
              color: white !important;
              transition: 0.4s;
              font-size: medium;
              border: none !important;
              min-height: 4vh;
              border-radius: 4px;
              width: 100%;
              margin-top: 10px;
              box-shadow: 0px 0px 10px 1px #bebebe;" class="btn searchBtn">` +
          'Start visual search <i class="fa fa-search" style="margin-left: 5px;"></i>' +
          "</button>" +
          '<input type="hidden" name="secondid" class="image-url" value="10f066701464ae9092702db94fc16ea1387b651d93685d4e1cb9b2090736965739f6794ed4ec8f48f1747c655ab03371ce0055dcd88e98fa689f8b9603f7dc27a0df68f42eab3651" />' +

          "</form>";
        console.log(this);
        addImg(this, ".status", content);
      }
    };
    run(this);
  }
}

customElements.define("upload-image", ImageUpload);
