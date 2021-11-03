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
    <h2 id="click-to-upload">Choose Files</h2>
    <div type="hidden" class="dropzone">
    <div  style="font-weight: bold;"class="info"></div>
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
      console.log("lallalala");
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
            //   response = JSON.parse(
            //     '{"data": {"id": "orunSTu","title": null,"description": null,"datetime": 1495556889,"type": "image/gif","animated": false,"width": 1,"height": 1,"size": 42,"views": 0,"bandwidth": 0,"vote": null,"favorite": false,"nsfw": null,"section": null,"account_url": null,"account_id": 0,"is_ad": false,"in_most_viral": false,"tags": [],"ad_type": 0,"ad_url": "","in_gallery": false,"deletehash": "x70po4w7BVvSUzZ","name": "","link": "http://i.imgur.com/orunSTu.gif"},"success": true,"status": 200}'
            //   );
               response = this.responseText;
            }
            callback.call(that._shadowRoot, response);
          } else {
            // response = JSON.parse(
            //   '{"data": {"id": "orunSTu","title": null,"description": null,"datetime": 1495556889,"type": "image/gif","animated": false,"width": 1,"height": 1,"size": 42,"views": 0,"bandwidth": 0,"vote": null,"favorite": false,"nsfw": null,"section": null,"account_url": null,"account_id": 0,"is_ad": false,"in_most_viral": false,"tags": [],"ad_type": 0,"ad_url": "","in_gallery": false,"deletehash": "x70po4w7BVvSUzZ","name": "","link": "http://i.imgur.com/orunSTu.gif"},"success": true,"status": 200}'
            // );
            callback.call(that._shadowRoot, response);
             throw new Error("yes - ya");
          }
        }
      };
      xhttp.send(data);
      xhttp = null;
    }
    function createDragZone(that) {
      var p2, input;
      p2 = createEls("p", {}, "Click here to select image");
      input = createEls("input", {
        type: "file",
        multiple: "multiple",
        className: "input",
        accept: "image/*",
      });

      Array.prototype.forEach.call(
        that.info,
        function (zone) {
          zone.appendChild(p2);
        }.bind(that)
      );
      Array.prototype.forEach.call(
        that.dropzone,
        function (zone) {
          zone.appendChild(input);
          status(that, zone);
          upload(that, zone);
        }.bind(that)
      );
    }
    // function loading(that) {
    //   var div, table, img;

    //   div = createEls(that, "div", { className: "loading-modal" });
    //   table = createEls(that, "table", { className: "loading-table" });
    //   img = createEls(that, "img", {
    //     className: "loading-image",
    //     src: "../assets/css/loading-spin.svg",
    //   });

    //   div.appendChild(table);
    //   table.appendChild(img);
    //   that._shadowRoot.appendChild(div);
    // }

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
          "<form>Image : " +
          '<input type="hidden" name="uri" class="image-url" value="Default:Search" />' +
          '<input type="hidden" name="image" class="image-url" value="' +
          get_link +
          '"/>' +
          '<img class="img-to-upload"  style="padding-top:15px !important; width: 100% !important;" alt="Imgur-Upload" src="' +
          get_link +
          '"/>' +
          '<button type="submit" style=" height: 39px" class="btn searchBtn">' +
          'Search<i class="fa fa-search" style="margin-left: 5px;"></i>' +
          "</button>" +
          "</form>";
        console.log(this);
        addImg(this, ".status", content);
      }
    };
    run(this);
  }
}

customElements.define("upload-image", ImageUpload);
