using Microsoft.EntityFrameworkCore.Migrations;

namespace DeviceManagementSystem.Migrations
{
    public partial class inadvertentlyuserhasadevicenotopposite : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DeviceDetails_AspNetUsers_UserId",
                table: "DeviceDetails");

            migrationBuilder.DropIndex(
                name: "IX_DeviceDetails_UserId",
                table: "DeviceDetails");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "DeviceDetails");

            migrationBuilder.AddColumn<int>(
                name: "DeviceId",
                table: "AspNetUsers",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_DeviceId",
                table: "AspNetUsers",
                column: "DeviceId");

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_DeviceDetails_DeviceId",
                table: "AspNetUsers",
                column: "DeviceId",
                principalTable: "DeviceDetails",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_DeviceDetails_DeviceId",
                table: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_DeviceId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "DeviceId",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "DeviceDetails",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_DeviceDetails_UserId",
                table: "DeviceDetails",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_DeviceDetails_AspNetUsers_UserId",
                table: "DeviceDetails",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
